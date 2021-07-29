# passport-ground-truth

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating with HexLab's [Ground Truth](https://github.com/hackgt/ground-truth) using the OAuth 2.0 API.

This module lets you authenticate using Ground Truth in your Node.js applications. You can easily use Passport to integrate into different frameworks like express.

## Install

```shell
$ npm install passport-ground-truth --save
```

## Usage

### Configure Strategy

The Ground Truth authentication strategy authenticates users using a Ground Truth account and Oauth 2.0 tokens. The strategy requires a `verify` callback, which accepts these credentials and calls `done` providing a user, as well as `options`, specifying a client ID, client secret, callback URL, and base URL.

```js
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
app.get("/auth/login", passport.authenticate("groundtruth"));

app.get(
  "/auth/login/callback",
  passport.authenticate("groundtruth", {
    failureRedirect: "/login",
    successReturnToOrRedirect: "/",
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
```

## Attribution

- [passport-instagram](https://github.com/jaredhanson/passport-instagram)

## License

[The MIT License](http://opensource.org/licenses/MIT)
