import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
console.log("passport.js module is running");

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH_DIRECT_URL,
  },
  () => {
    // passport callback function
  })
);

export default passport;
