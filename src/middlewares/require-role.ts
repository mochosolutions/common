// import { Request, Response, NextFunction } from 'express';
// import { NotAuthorizedError  } from '../index';

// export const requireRole = (roles: string[] = []) => {
//   return (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     console.log("req.currentUser", req.currentUser);
//     if (!req.currentUser) {
//       throw new NotAuthorizedError();
//     }

//     console.log("Roles Check", roles);
//     // console.log("currentRole", req.currentUser)
    
//     if (roles.length && !roles.includes(req.currentUser.role)) {
//       throw new NotAuthorizedError();
//     }
//     next();
//   };
// }



