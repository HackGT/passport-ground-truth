import {
  InternalOAuthError,
  Strategy as OAuth2Strategy,
} from "passport-oauth2";

export interface StrategyOption {
  clientID: string | undefined;
  clientSecret: string | undefined;
  baseURL?: string;
  callbackURL: string;
  authorizationURL?: string;
  tokenURL?: string;
}

export interface Profile {
  uuid: string;
  name: string;
  email: string;
  token: string;
}

type VerifyFunction = (
  req: Express.Request,
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: (error: Error | null, user?: Express.User) => void
) => void;

export class GroundTruthStrategy extends OAuth2Strategy {
  public readonly baseURL: string;

  constructor(options: StrategyOption, verify: VerifyFunction) {
    if (!options.clientID || !options.clientSecret) {
      throw new Error(
        "Client ID or secret not configured for Ground Truth authentication"
      );
    }

    if (!options.baseURL) {
      throw new Error(
        "Base URL not configured for Ground Truth authentication"
      );
    }

    super(
      {
        clientID: options.clientID,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackURL,
        authorizationURL:
          options.authorizationURL ||
          new URL("/oauth/authorize", options.baseURL).toString(),
        tokenURL:
          options.tokenURL ||
          new URL("/oauth/token", options.baseURL).toString(),
        passReqToCallback: true,
      },
      verify
    );

    this.name = "groundtruth";
    this.baseURL = options.baseURL;
  }

  public userProfile(
    accessToken: string,
    done: (err: Error | null, profile?: any) => void
  ) {
    this._oauth2.get(
      new URL("/api/user", this.baseURL).toString(),
      accessToken,
      function (err, body) {
        if (err) {
          return done(
            new InternalOAuthError("Failed to fetch user profile", err)
          );
        }

        try {
          const profile = {
            ...JSON.parse(body as any),
            token: accessToken,
          };
          done(null, profile);
        } catch (e) {
          done(e);
        }
      }
    );
  }
}
