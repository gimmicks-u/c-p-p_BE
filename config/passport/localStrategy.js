const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authDao = require('../../src/daos/authDao');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        const user = await authDao.selectUser(email, password);
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      }
    )
  );
};
