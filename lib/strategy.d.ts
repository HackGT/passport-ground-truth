import passport = require("passport");
import express = require("express");

export interface Profile extends passport.Profile {
  uuid: string;
  name: string;
  email: string;
  token: string;
}

export interface StrategyOptionBase {
  clientID: string;
  clientSecret: string;
  baseURL: string;
  callbackURL: string;
  authorizationURL?: string | undefined;
  tokenURL?: string | undefined;
  profileURL?: string | undefined;
}

export interface StrategyOption extends StrategyOptionBase {
  passReqToCallback?: false | undefined;
}

export interface StrategyOptionWithRequest extends StrategyOptionBase {
  passReqToCallback: true;
}

export class Strategy extends passport.Strategy {
  constructor(
    options: StrategyOption,
    verify: (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: Error | null, user?: any) => void
    ) => void
  );
  constructor(
    options: StrategyOptionWithRequest,
    verify: (
      req: express.Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: Error | null, user?: any) => void
    ) => void
  );

  name: string;
  authenticate(req: express.Request, options?: object): void;
}
