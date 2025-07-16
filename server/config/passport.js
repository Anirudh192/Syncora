import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "dotenv";
import pool from "../db.js";
import {generateAccessToken, generateRefreshToken} from "../utils/token.js";

env.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;

      // console.log(profile.photos?.[0]?.value)
      const profilePhoto = profile.photos?.[0]?.value;

      try {
        const existingUser = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        let user;

        if (existingUser.rows.length > 0) {
          user = existingUser.rows[0];
        } else {
          const newUser = await pool.query(
            "INSERT INTO users ( name, email, password,avatar) VALUES ($1, $2, $3, $4) RETURNING *",
            [profile.displayName, email,"google",profilePhoto]
          );
          user = newUser.rows[0];
        }

        const refreshToken = generateRefreshToken(user);
        await pool.query("INSERT INTO refresh_tokens(user_id,token) VALUES ($1,$2)",[user.id,refreshToken]);

        const accessToken = generateAccessToken(user);
        return done(null, { ...user, refreshToken,accessToken });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
