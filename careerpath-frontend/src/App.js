import React from 'react';
import Courses from './Pages/Courses';
import PersonalInformation from './Pages/PersonalInformation';
import Unauthenticated from './Pages/Unauthenticated';
import WantToBeCoach from './Pages/WantToBeCoach';

import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CoachesBySpecialization from './Pages/CoachesBySpecialization';
import Appointments from './Pages/Appointments';
import Dashboard from './Pages/Dashboard';
import Users from './Pages/Users';
import AdminAppointments from './Pages/AdminAppointments';
function App() {
  const { token, user } = useSelector((state) => state.userDetails);

  let view;

  const unauthenticated = (
    <Switch>
      <Route exact path='/' component={Unauthenticated} />
      <Route>
        <Redirect to='/' />
      </Route>
    </Switch>
  );
  const coach = (
    <Switch>
      <Route path='/become-coach' component={WantToBeCoach} />
      <Route path='/appointments' component={Appointments} />
      <Route exact path='/profile/:userId' component={PersonalInformation} />
      <Route>
        <Redirect to='/become-coach' />
      </Route>
    </Switch>
  );

  const student = (
    <Switch>
      <Route path='/recommendations' component={Courses} />
      <Route exact path='/profile/:userId' component={PersonalInformation} />
      <Route path='/coaches/:id' component={CoachesBySpecialization} />
      <Route path='/appointments' component={Appointments} />
      <Route>
        <Redirect to='/recommendations' />
      </Route>
    </Switch>
  );

  const admin = (
    <Switch>
      <Route path='/dashboard' component={Dashboard} />
      <Route path='/admin/users/:userType' component={Users} />
      <Route path='/admin/appointments/' component={AdminAppointments} />
      <Route exact path='/profile/:userId' component={PersonalInformation} />
      <Route>
        <Redirect to='/dashboard' />
      </Route>
    </Switch>
  );

  if (token && user.userType === 'student') {
    view = student;
  } else if (token && user.userType === 'coach') {
    view = coach;
  } else if (token && user.userType === 'admin') {
    view = admin;
  } else {
    view = unauthenticated;
  }

  return (
    <div className='App'>
      <Router>{view}</Router>
    </div>
  );
}

export default App;
