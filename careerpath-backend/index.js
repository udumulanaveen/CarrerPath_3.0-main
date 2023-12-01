const express = require('express');
const multer = require('multer');
const logger = require('morgan');
const cors = require('cors');
const moment = require('moment');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./career-path-fc2bd-firebase-adminsdk-34tne-fe06618bc7.json');
const { tokenForUser } = require('./utils');
const coursesDump = require('./courses.json');
const fs = require('fs');

app.use(logger('dev'));
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.options('*', cors());
const fileDir = './uploads';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, fileDir);
  },

  filename: function (req, file, cb) {
    let fileName = Date.now() + '-' + file.originalname;
    req.uploadedFile = fileName;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage }).single('document');

function uploadAsync(req, res, next) {
  return new Promise(function (resolve, reject) {
    upload(req, res, async function (err) {
      if (err || err !== undefined) return res.json(err);
      return res.json({
        success: true,
        uploadedFile: req.uploadedFile,
      });
    });
  });
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://career-path-fc2bd-default-rtdb.firebaseio.com',
});

let db = admin.firestore();

app.get('/', (req, res) => {
  res.send({ message: 'No cookie for you' });
});

const userRef = db.collection('users');
const educationRef = db.collection('education');
const experienceRef = db.collection('experiences');
const certficationRef = db.collection('certifications');
const resumeRef = db.collection('resume');
const appointmentRef = db.collection('appointments');
const slotsRef = db.collection('slots');
const areaOfSpecializationRef = db.collection('areaOfSpecialization');

app.post('/create', async (req, res) => {
  try {
    let data = req.body;
    console.log(req.body);
    let {
      email,
      username,
      password,
      userType,
      startYear,
      endYear,
      highestEducation,
      grade,
      nameOfCompany,
      yearsOfExperience,
      role,
      documentId,
      resumeId,
    } = data;
    const fields =
      'email,username,password,userType,startYear,endYear,highestEducation,grade,nameOfCompany,yearsOfExperience,role,documentId,resumeId'.split(
        ','
      );
    for (let eachField of fields) {
      console.log(eachField, data[eachField.trim()]);
      if (!data[eachField.trim()])
        return res.json({ success: false, message: 'All fields are mandatory!', field: eachField });
    }

    const emailFind = await userRef.where('email', '==', email).get();
    const usernameFind = await userRef.where('username', '==', username).get();

    if (!emailFind.empty) {
      return res.json({ success: false, message: 'email already exists!' });
    }
    if (!usernameFind.empty) {
      return res.json({ success: false, message: 'username already exists!' });
    }

    const userJson = {
      email,
      username,
      password,
      userType,
    };

    let uploadedUser = await userRef.add(userJson);

    await educationRef.add({ userId: uploadedUser.id, startYear, endYear, highestEducation, grade });

    await experienceRef.add({ userId: uploadedUser.id, nameOfCompany, yearsOfExperience, role });

    await resumeRef.add({ userId: uploadedUser.id, resumeId });

    await certficationRef.add({ userId: uploadedUser.id, documentId });

    const experienceFinds = await experienceRef.where('userId', '==', uploadedUser.id).get();

    let experienceArr = [];
    if (experienceFinds.size > 0) {
      for (let eachRec of experienceFinds.docs) {
        let eacRecordData = eachRec.data();
        experienceArr.push({ ...eacRecordData, id: eachRec.id });
      }
    }

    const educationFinds = await educationRef.where('userId', '==', uploadedUser.id).get();

    let educationArr = [];
    if (educationFinds.size > 0) {
      for (let eachRec of educationFinds.docs) {
        let eacRecordData = eachRec.data();
        educationArr.push({ ...eacRecordData, id: eachRec.id });
      }
    }

    const resumeFinds = await resumeRef.where('userId', '==', uploadedUser.id).get();

    let resumeArr = [];
    if (resumeFinds.size > 0) {
      for (let eachRec of resumeFinds.docs) {
        let eacRecordData = eachRec.data();
        resumeArr.push({ ...eacRecordData, id: eachRec.id });
      }
    }

    const certificationsFinds = await certficationRef.where('userId', '==', uploadedUser.id).get();

    let certificationsArr = [];
    if (certificationsFinds.size > 0) {
      for (let eachRec of certificationsFinds.docs) {
        let eacRecordData = eachRec.data();
        certificationsArr.push({ ...eacRecordData, id: eachRec.id });
      }
    }

    const user = await userRef.doc(uploadedUser.id).get();

    const token = tokenForUser(user.data());

    const specializationFinds =
      user.areaOfSpecialization && (await areaOfSpecializationRef.doc(user.areaOfSpecialization).get());

    specialization = null;

    if (specializationFinds && specializationFinds.exists) {
      specialization = specializationFinds.data();
    }

    return res.json({
      success: true,
      user: { ...user.data(), id: uploadedUser.id, specialization },
      certifications: certificationsArr,
      resume: resumeArr,
      education: educationArr,
      experience: experienceArr,
      token,
      message: 'user successfully created!',
    });
  } catch (err) {
    console.log(err);
  }
});

app.post('/login', async (req, res) => {
  try {
    let data = req.body;
    let { emailOrUsername, password } = data;
    const fields = 'password,emailOrUsername'.split(',');
    for (let eachField of fields) {
      console.log(eachField, data[eachField.trim()]);
      if (!data[eachField.trim()])
        return res.json({ success: false, message: 'All fields are mandatory!', field: eachField });
    }

    const emailFind = await userRef.where('email', '==', emailOrUsername).get();
    const usernameFind = await userRef.where('username', '==', emailOrUsername).get();

    if (emailFind.empty && usernameFind.empty) {
      return res.json({ success: false, message: 'Invalid credentials!' });
    }

    let user = null;
    if (emailFind.size > 0) {
      let emailF = emailFind.docs[0].data();
      user = { ...emailF, id: emailFind.docs[0].id };
    }

    if (usernameFind.size > 0) {
      let usernameF = usernameFind.docs[0].data();
      user = { ...usernameF, id: usernameFind.docs[0].id };
    }

    if (password !== user.password) return res.json({ success: false, message: 'Invalid credentials' });

    const experienceFinds = await experienceRef.where('userId', '==', user.id).get();

    let experienceArr = [];
    if (experienceFinds.size > 0) {
      for (let eachRec of experienceFinds.docs) {
        let eacRecordData = eachRec.data();
        experienceArr.push({ ...eacRecordData, id: eachRec.id });
      }
    }

    const educationFinds = await educationRef.where('userId', '==', user.id).get();

    let educationArr = [];
    if (educationFinds.size > 0) {
      for (let eachRec of educationFinds.docs) {
        let eacRecordData = eachRec.data();
        educationArr.push({ ...eacRecordData, id: eachRec.id });
      }
    }

    const resumeFinds = await resumeRef.where('userId', '==', user.id).get();

    let resumeArr = [];
    if (resumeFinds.size > 0) {
      for (let eachRec of resumeFinds.docs) {
        let eacRecordData = eachRec.data();
        resumeArr.push({ ...eacRecordData, id: eachRec.id });
      }
    }

    const certificationsFinds = await certficationRef.where('userId', '==', user.id).get();

    let certificationsArr = [];
    if (certificationsFinds.size > 0) {
      for (let eachRec of certificationsFinds.docs) {
        let eacRecordData = eachRec.data();
        certificationsArr.push({ ...eacRecordData, id: eachRec.id });
      }
    }

    const token = tokenForUser(user);
    const specializationFinds =
      user.areaOfSpecialization && (await areaOfSpecializationRef.doc(user.areaOfSpecialization).get());

    specialization = null;
    if (specializationFinds && specializationFinds.exists) {
      specialization = specializationFinds.data();
    }

    return res.json({
      success: true,
      user: { ...user, specialization, id: user.id },
      certifications: certificationsArr,
      resume: resumeArr,
      education: educationArr,
      experience: experienceArr,
      specialization,
      token,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post('/bookAppointment', async (req, res) => {
  try {
    const { studentId, coachId, slotId, contact, oldSlotId, oldAppointmentId } = req.body;
    await slotsRef.doc(slotId).update({ booked: 1 });
    if (oldSlotId && oldAppointmentId) {
      await slotsRef.doc(oldSlotId).update({ booked: 0 });
      await appointmentRef.doc(oldAppointmentId).delete();
    }

    await appointmentRef.add({ studentId, coachId, slotId, contact });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post('/delete/appointment', async (req, res) => {
  try {
    const { oldSlotId, oldAppointmentId } = req.body;
    if (oldSlotId && oldAppointmentId) {
      await slotsRef.doc(oldSlotId).update({ booked: 0 });
      await appointmentRef.doc(oldAppointmentId).delete();
    }

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

app.get('/appointments/:userType/:userId', async (req, res) => {
  try {
    const { userId, userType } = req.params;
    console.log(req.params);
    const finds = await appointmentRef.where(userType + 'Id', '==', userId).get();

    let arr = [];
    if (finds.size > 0) {
      for (let eachApp of finds.docs) {
        let eachappointment = eachApp.data();
        let ut = eachappointment.studentId;
        if (userType === 'student') {
          ut = eachappointment.coachId;
        }

        let otherUser = await userRef.doc(ut).get();
        let slot = await slotsRef.doc(eachappointment.slotId).get();
        let data = { ...eachappointment, isCoach: userType !== 'student', id: eachApp.id };
        if (otherUser.exists) {
          data[`otherUserDetails`] = { contact: eachappointment.contact, ...otherUser.data() };
          data[`otherUserDetails`][`id`] = otherUser.id;

          if (data.otherUserDetails.areaOfSpecialization) {
            const specializationFinds = await areaOfSpecializationRef
              .doc(data.otherUserDetails.areaOfSpecialization)
              .get();
            let specialization = specializationFinds.data();
            data[`specialization`] = specialization;
            data[`specializationId`] = specialization.id;
          }
        }
        if (slot.exists) {
          data[`slotDetails`] = slot.data();
          data.slotDetails.start = data.slotDetails.start.toDate();
          data.slotDetails.date = moment(data.slotDetails.date);
          data.slotDetails.id = slot.id;
        }

        arr.push(data);
      }
    }
    return res.json({ success: true, appointments: arr });
  } catch (err) {
    console.log(err);
  }
});

app.post('/get-slots', async (req, res) => {
  try {
    const { date, coachId } = req.body;
    var start = new Date(date);
    start.setHours(0, 0, 0, 1);

    var end = new Date(start.getTime());
    end.setHours(23, 59, 59, 999);

    let finds = await slotsRef.where('date', '>=', start).where('date', '<=', end).get();

    if (finds.empty) {
      let hours = Array.from(Array(25).keys());
      hours = hours.slice(9, 22);
      hours = hours.map((h) => (h > 9 ? `${h.toString()}:00` : `0${h}:00`));
      for (let eachSlot of hours) {
        const newSlotTime = getTimeOfTheDayAt(date, eachSlot);
        await slotsRef.add({
          date: start,
          start: moment(newSlotTime),
          booked: 0,
          coachId,
        });
      }
    }

    let arr = [];
    finds = await slotsRef.where('date', '>=', start).where('date', '<=', end).get();
    for (let eachSlot of finds.docs) {
      let slot = eachSlot.data();
      arr.push({
        ...slot,
        id: eachSlot.id,
        start: slot.start.toDate(),
        date: slot.date.toDate(),
      });
    }

    let sortedSlots = arr.sort(function (a, b) {
      return new Date(moment(a.start) - new Date(moment(b.start)));
    });

    return res.json({
      success: true,
      slots: sortedSlots.map((a) => ({ ...a, start: moment(a.start).format('hh:mm A') })),
    });
  } catch (err) {
    console.log(err);
  }
});

app.post('/educationInfo/update/:userId', async (req, res) => {
  try {
    let { startYear, endYear, highestEducation, grade } = req.body;
    let { userId } = req.params.id;

    await educationRef.where('userId', '==', userId).update({ startYear, endYear, highestEducation, grade });
    const eduref = await educationRef.where('userId', '==', userId).get();
    const education = { ...eduref.docs[0].data(), id: userRef.id };
    return res.json({ success: true, education: education });
  } catch (err) {
    console.log(err);
  }
});

app.post('/professionalInfo/update/:userId', async (req, res) => {
  try {
    let { nameOfCompany, yearsOfExperience, experienceRole } = req.body.experience;
    let { userId } = req.params.id;

    await experienceRef.where('userId', '==', userId).update({ nameOfCompany, yearsOfExperience, experienceRole });
    const expref = await experienceRef.where('userId', '==', userId).get();
    const experience = { ...expref.docs[0].data(), id: userRef.id };
    return res.json({ success: true, experience: experience });
  } catch (err) {
    console.log(err);
  }
});

app.get('/admin/appointments', async (req, res) => {
  try {
    const finds = await appointmentRef.get();

    let arr = [];
    if (finds.size > 0) {
      for (let eachApp of finds.docs) {
        let eachappointment = eachApp.data();
        let otherUser = await userRef.doc(eachappointment.coachId).get();
        let slot = await slotsRef.doc(eachappointment.slotId).get();
        let data = { ...eachappointment, id: eachApp.id };
        if (otherUser.exists) {
          data[`coachDetails`] = { contact: eachappointment.contact, ...otherUser.data() };
          data[`coachDetails`][`id`] = otherUser.id;

          if (data.coachDetails.areaOfSpecialization) {
            const specializationFinds = await areaOfSpecializationRef.doc(data.coachDetails.areaOfSpecialization).get();
            let specialization = specializationFinds.data();
            data[`specialization`] = specialization;
            data[`specializationId`] = specialization.id;
          }
        }
        if (slot.exists) {
          data[`slotDetails`] = slot.data();
          data.slotDetails.start = data.slotDetails.start.toDate();
          data.slotDetails.date = moment(data.slotDetails.date);
          data.slotDetails.id = slot.id;
        }

        arr.push(data);
      }
    }

    return res.json({ success: true, appointments: arr });
  } catch (err) {
    console.log(err);
  }
});

app.get('/admin/users/:userType', async (req, res) => {
  try {
    const finds = await userRef.where('userType', '==', req.params.userType).get();

    let arr = [];
    if (finds.size > 0) {
      for (let eachApp of finds.docs) {
        let eachuser = eachApp.data();

        arr.push({ ...eachuser, id: eachApp.id });
      }
    }
    return res.json({ success: true, users: arr });
  } catch (err) {
    console.log(err);
  }
});

app.get('/user/:userId', async (req, res) => {
  try {
    const finds = await userRef.doc(req.params.userId).get();

    let eachUser = finds.data();

    return res.json({ success: true, user: eachUser });
  } catch (err) {
    console.log(err);
  }
});

app.post('/updateBasicInfo/:userId', async (req, res) => {
  try {
    const data = req.body;
    const { name, email, password, username } = data;
    const fields = 'email,username,password,name'.split(',');
    for (let eachField of fields) {
      console.log(eachField, data[eachField.trim()]);
      if (!data[eachField.trim()])
        return res.json({ success: false, message: 'All fields are mandatory!', field: eachField });
    }

    await userRef.doc(req.params.userId).update({ name, email, password, username });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post('/updateEducationalInfo/:eduId', async (req, res) => {
  try {
    const data = req.body;
    const { startYear, endYear, grade, highestEducation } = data;
    const fields = 'startYear,endYear,grade,highestEducation'.split(',');
    for (let eachField of fields) {
      console.log(eachField, data[eachField.trim()]);
      if (!data[eachField.trim()])
        return res.json({ success: false, message: 'All fields are mandatory!', field: eachField });
    }

    await educationRef.doc(req.params.eduId).update({ startYear, endYear, grade, highestEducation });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post('/updateProfessionalInfo/:proId', async (req, res) => {
  try {
    const data = req.body;
    const { nameOfCompany, yearsOfExperience, role } = data;
    const fields = 'nameOfCompany,yearsOfExperience,role'.split(',');
    for (let eachField of fields) {
      console.log(eachField, data[eachField.trim()]);
      if (!data[eachField.trim()])
        return res.json({ success: false, message: 'All fields are mandatory!', field: eachField });
    }

    await experienceRef.doc(req.params.proId).update({ nameOfCompany, yearsOfExperience, role });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

app.get('/profile/:userId', async (req, res) => {
  try {
    let userId = req.params.userId;

    const finds = await userRef.doc(userId).get();

    let user = finds.data();

    const experienceFinds = await experienceRef.where('userId', '==', userId).get();

    let experienceArr = [];
    if (experienceFinds.size > 0) {
      for (let eachRec of experienceFinds.docs) {
        let eacRecordData = eachRec.data();
        experienceArr.push({ ...eacRecordData, id: eachRec.id });
      }
    }

    const educationFinds = await educationRef.where('userId', '==', userId).get();

    let educationArr = [];
    if (educationFinds.size > 0) {
      for (let eachRec of educationFinds.docs) {
        let eacRecordData = eachRec.data();
        educationArr.push({ ...eacRecordData, id: eachRec.id });
      }
    }

    const resumeFinds = await resumeRef.where('userId', '==', userId).get();

    let resumeArr = [];
    if (resumeFinds.size > 0) {
      for (let eachRec of resumeFinds.docs) {
        let eacRecordData = eachRec.data();
        resumeArr.push({ ...eacRecordData, id: eachRec.id });
      }
    }

    const certificationsFinds = await certficationRef.where('userId', '==', userId).get();

    let certificationsArr = [];
    if (certificationsFinds.size > 0) {
      for (let eachRec of certificationsFinds.docs) {
        let eacRecordData = eachRec.data();
        certificationsArr.push({ ...eacRecordData, id: eachRec.id });
      }
    }

    const specializationFinds =
      user.areaOfSpecialization && (await areaOfSpecializationRef.doc(user.areaOfSpecialization).get());

    specialization = null;
    if (specializationFinds && specializationFinds.exists) {
      specialization = specializationFinds.data();
    }

    return res.json({
      success: true,
      experienceId: experienceArr[0]['id'],
      educationId: educationArr[0]['id'],
      id: req.params.userId,
      user: { ...user, id: req.params.userId },
      basicInfo: {
        username: user.username,
        password: user.password,
        name: user.name || null,
        email: user.email || null,
        contact: user.contact || null,
      },
      experienceInfo: {
        nameOfCompany: experienceArr[0]['nameOfCompany'],
        yearsOfExperience: experienceArr[0]['yearsOfExperience'],
        role: experienceArr[0]['role'],
      },
      educationInfo: {
        startYear: educationArr[0]['startYear'],
        endYear: educationArr[0]['endYear'],
        grade: educationArr[0]['grade'],
        highestEducation: educationArr[0]['highestEducation'],
      },
      certifications: certificationsArr,
      resume: resumeArr,
      education: educationArr,
      experience: experienceArr,
      specialization,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get('/user/delete/:id', async (req, res) => {
  try {
    await appointmentRef
      .where('studentId', '==', req.params.id)
      .where('coachId', '==', req.params.id)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });

    await slotsRef
      .where('coachId', '==', req.params.id)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });

    await educationRef
      .where('userId', '==', req.params.id)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });

    await resumeRef
      .where('userId', '==', req.params.id)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });

    await experienceRef
      .where('userId', '==', req.params.id)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.data();
          doc.ref.delete();
        });
      });

    await userRef.doc(req.params.id).delete();

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

app.get('/download/:filename', async (req, res) => {
  try {
    const src = fs.createReadStream(`./uploads/${req.params.filename}`);
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=sample.pdf',
      'Content-Transfer-Encoding': 'Binary',
    });

    src.pipe(res);
  } catch (err) {
    console.log(err);
  }
});

app.post('/upload', uploadAsync);

const populateCourses = async () => {
  let alreadyExistedCourses = await areaOfSpecializationRef.get();
  if (!alreadyExistedCourses.size) {
    for (let eachCourse of coursesDump) {
      await areaOfSpecializationRef.add(eachCourse);
    }
  }
};

populateCourses();

app.get('/specializations', async (req, res) => {
  try {
    await populateCourses();
    const finds = await areaOfSpecializationRef.get();

    let arr = [];
    if (finds.size > 0) {
      for (let eachApp of finds.docs) {
        let eachuser = eachApp.data();

        arr.push({ ...eachuser, id: eachApp.id });
      }
    }
    return res.json({ success: true, specializations: arr });
  } catch (err) {
    console.log(err);
  }
});

app.post('/addSpecialization/:userId', async (req, res) => {
  try {
    await userRef
      .doc(req.params.userId)
      .update({ areaOfSpecialization: req.body.areaOfSpecialization, contact: req.body.contact });

    let user = await userRef.doc(req.params.userId).get();

    let eachuser = user.data();

    return res.json({ success: true, user: { id: user.id, ...eachuser } });
  } catch (err) {
    console.log(err);
  }
});

app.get('/specializationCoaches/:specializationId', async (req, res) => {
  try {
    const finds = await userRef.where('areaOfSpecialization', '==', req.params.specializationId).get();

    const specializationFinds = await areaOfSpecializationRef.doc(req.params.specializationId).get();

    let specialization = specializationFinds.data();

    let arr = [];
    if (finds.size > 0) {
      for (let eachApp of finds.docs) {
        let eachuser = eachApp.data();

        arr.push({ ...eachuser, id: eachApp.id, specialization });
      }
    }
    return res.json({ success: true, coaches: arr });
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 8000;

const getTimeOfTheDayAt = (d, t) => {
  let dateTime = moment(d).format('YYYY-MM-DD');
  dateTime = moment(dateTime).set('hour', +t.split(':')[0]);
  dateTime = moment(dateTime).set('minute', +t.split(':')[1]);

  return dateTime;
};

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
