/**
 * Module dependencies.
 */
var util = require("util"),
  OAuth2Strategy = require("passport-oauth2").Strategy,
  InternalOAuthError = require("passport-oauth2").InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The Ground Truth authentication strategy authenticates requests by delegating to
 * Ground Truth using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts a `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`       your Ground Truth application's client id
 *   - `clientSecret`   your Ground Truth application's client secret
 *   - `callbackURL`    URL to which Ground Truth will redirect the user after obtaining authorization
 *   - `baseURL`        base URL for which the Ground Truth server resides to authenticate with
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};

  options.authorizationURL =
    options.authorizationURL ||
    (options.baseURL &&
      new URL("/oauth/authorize", options.baseURL).toString());
  options.tokenURL =
    options.tokenURL ||
    (options.baseURL && new URL("/oauth/token", options.baseURL).toString());

  OAuth2Strategy.call(this, options, verify);

  this.name = "groundtruth";
  this._profileURL =
    options.profileURL ||
    (options.baseURL && new URL("/api/user", options.baseURL).toString());

  if (!options.authorizationURL || !options.tokenURL || !this._profileURL) {
    throw new Error(
      "Client ID, secret, or profile url not configured for Ground Truth"
    );
  }
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Ground Truth.
 *
 * This function constructs a normalized profile
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(this._profileURL, accessToken, function (err, body, res) {
    if (err) {
      return done(new InternalOAuthError("Failed to fetch user profile", err));
    }

    try {
      const profile = {
        ...JSON.parse(body),
        token: accessToken,
      };
      done(null, profile);
    } catch (e) {
      done(e);
    }
  });
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
