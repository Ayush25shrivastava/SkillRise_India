import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {

    const email = profile.emails[0].value;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email,
        password: "google-auth"
      });
    }

    return done(null, user);
  }
));