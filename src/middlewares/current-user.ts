import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { get } from 'lodash';

export interface UserPayload {
  id: string;
  email: string;
  sub: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

const getTokenFromHeader = (headersObj: any) => {
  console.log("headerObj", headersObj);
  const authHeader = get(headersObj, ['authorization'], '');
  // console.log("authHeader", authHeader)
  const arr = authHeader.split(" ")
  return arr[1];
}

const jwksClient = jwksRsa({
  cache: true,
  rateLimit: true,
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
});


// export const currentUser = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {

//   const token = getTokenFromHeader(req.headers);

//   // console.log("uesrtoken", token)
//   if (!token) {
//     return next();
//   }

//   try {
//     const payload = jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_KEY!
//     ) as UserPayload;
//     // console.log("currentUser", payload)
//     req.currentUser = payload;
//   } catch (err) {}

//   next();
// };


const getSigningKey = (header: any, callback: any) => {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    if (key) {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    } else {
      callback(new Error('Signing key not found'));
    }
  });
};


export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = getTokenFromHeader(req.headers);
  
  console.log("Token....", "token...")
  if (!token) {
    return next();
  }

  // Verify the token using the public key from Cognito JWKS
  jwt.verify(token, getSigningKey, {
    algorithms: ['RS256'],  // AWS Cognito uses RS256 algorithm for signing JWTs
    issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,  // Ensure the token is issued by your Cognito user pool
  }, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return next();
    }

    console.log("Decoded", decoded)
    // If token is valid, attach the decoded user payload to req.currentUser
    req.currentUser = decoded as UserPayload;
    next();
  });
};
