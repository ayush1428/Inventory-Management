// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const JwtStrategy = require("passport-jwt").Strategy;
// const ExtractJwt = require("passport-jwt").ExtractJwt;
// const { Signup } = require("./models/mongodb");

// // Configure local strategy for username/password authentication
// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "username",
//       passwordField: "password",
//     },
//     async (username, password, done) => {
//       try {
//         const user = await Signup.findOne({ username });

//         if (!user || !user.validatePassword(password)) {
//           return done(null, false, { message: "Invalid username or password" });
//         }

//         return done(null, user);
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );

// // Configure JWT strategy for token-based authentication
// passport.use(
//   new JwtStrategy(
//     {
//       secretOrKey: "ayush123",
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     },
//     async (payload, done) => {
//       try {
//         const user = await Signup.findById(payload.sub);

//         if (!user) {
//           return done(null, false, { message: "User not found" });
//         }

//         return done(null, user);
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );

// module.exports = passport;

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { Signup } = require("./models/mongodb");

// Configure local strategy for username/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await Signup.findOne({ username });

        if (!user || !user.validatePassword(password)) {
          return done(null, false, { message: "Invalid username or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configure JWT strategy for token-based authentication
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
opts.secretOrKey = "ayush123";

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await Signup.findById(payload.sub);

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

module.exports = passport;
