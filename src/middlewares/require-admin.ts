// import { Request, Response, NextFunction } from 'express';
// import { NotAuthorizedError  } from '../index';

// export const requireAdmin = (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     console.log("requireAdmin req.currentUser", req.currentUser);
//     if (!req.currentUser) {
//       throw new NotAuthorizedError();
//     }

//     if(!req.currentUser.isAdmin){
//       throw new NotAuthorizedError();
//     }

//     next();
// };

