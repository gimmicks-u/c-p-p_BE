const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const authDao = require('../../src/daos/authDao');
const usersDao = require('../../src/daos/usersDao');

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        callbackURL: '/auth/google/callback',
        clientSecret: process.env.GOOGLE_SECRET,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('google profile', profile);
        const user = await authDao.selectUserBySnsId(
          Number(profile.id),
          'google'
        );
        if (user) {
          if (Object.keys(user).length > 0) {
            done(null, user);
          } else {
            //회원가입시키는 코드
            const userDTO = {
              email: profile.email,
              name: profile.displayName,
              nickname: profile.displayName,
              profileURL: profile.picture,
              provider: 'google',
              snsId: profile.id,
            };
            const result = await usersDao.createUser(userDTO);
            if (result) {
              const user = await authDao.selectUserBySnsId(
                profile.id,
                'google'
              );
              done(null, user);
            } else {
              done(null, false);
            }
          }
        } else {
          done(null, false);
        }
      }
    )
  );
};
