const jwt = require('jsonwebtoken');

const tokenForUser = (u) =>
  jwt.sign({ userId: u.id }, 'ascljsjkvbsdkjvn', {
    expiresIn: '1 day',
    mutatePayload: true,
  });

module.exports = { tokenForUser };