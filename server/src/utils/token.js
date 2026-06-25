import jwt from "jsonwebtoken";

import env from "../config/env.js";

function signAccessToken(payload) {
  return jwt.sign(payload, env.auth.jwtAccessSecret, {
    expiresIn: env.auth.jwtAccessExpires,
  });
}

export { signAccessToken };
