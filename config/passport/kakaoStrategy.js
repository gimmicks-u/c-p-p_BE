const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const authDao = require('../../src/daos/authDao');
const usersDao = require('../../src/daos/usersDao');

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        const user = await authDao.selectUserBySnsId(profile.id, 'kakao');
        if (user) {
          if (Object.keys(user).length > 0) {
            done(null, user);
          } else {
            const userDTO = {
              email: profile._json.kakao_account.has_email
                ? profile._json.kakao_account.email
                : undefined,
              name: profile.username,
              nickname: profile.displayName,
              profileURL: profile._json.properties.profile_image,
              provider: 'kakao',
              snsId: profile.id,
            };
            const result = await usersDao.createUser(userDTO);
            if (result) {
              const user = await authDao.selectUserBySnsId(profile.id, 'kakao');
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
