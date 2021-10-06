# passport-ground-truth

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating with HexLab's [Ground Truth](https://github.com/hackgt/ground-truth) using the OAuth 2.0 API.

This module lets you authenticate using Ground Truth in your Node.js applications. You can easily use Passport to integrate into different frameworks like express.

## Install

```shell
$ npm install passport-ground-truth --save
$ npm install @types/passport-oauth2 --save-dev
```

## Usage

### Configure Strategy

The Ground Truth authentication strategy authenticates users using a Ground Truth account and Oauth 2.0 tokens. The strategy requires a `verify` callback, which accepts these credentials and calls `done` providing a user, as well as `options`, specifying a client ID, client secret, base URL, and callback URL.

```js
import { Strategy as GroundTruthStrategy } from "passport-ground-truth";

passport.use(
  new GroundTruthStrategy(
    {
      clientID: process.env.GROUND_TRUTH_CLIENT_ID,
      clientSecret: process.env.GROUND_TRUTH_CLIENT_SECRET,
      baseURL: process.env.GROUND_TRUTH_URL,
      callbackURL: "/auth/login/callback",
    },
    async (req, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ id: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);
```

### Authenticate Requests

Use `passport.authenticate()`, specifying the `"groundtruth"` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
import express from "express";

export let authRoutes = express.Router();

authRoutes.get("/login", passport.authenticate("groundtruth"));
```

#### Full Code Example (`auth.ts`)

```js
import express from "express";
import fetch from "node-fetch";
import passport from "passport";

export const authRoutes = express.Router();

authRoutes.get("/login", passport.authenticate("groundtruth"));

authRoutes.route("/login/callback").get((req, res, next) => {
  if (req.query.error === "access_denied") {
    res.redirect("/auth/login");
    return;
  }

  passport.authenticate("groundtruth", {
    failureRedirect: "/",
    successReturnToOrRedirect: "/",
  })(req, res, next);
});

authRoutes.route("/check").get((req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(400).json({ success: false });
  }
});

authRoutes.route("/logout").all(async (req, res) => {
  if (req.user) {
    try {
      await fetch(new URL("/api/user/logout", process.env.GROUND_TRUTH_URL).toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${req.user.token}`,
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      req.logout();
    }
  }

  res.redirect("/auth/login");
});
```

## Attribution

- [passport-instagram](https://github.com/jaredhanson/passport-instagram)

## License

[The MIT License](http://opensource.org/licenses/MIT)
