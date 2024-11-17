// import { Request, Response, NextFunction } from 'express';
// import { NotAuthorizedError  } from '../index';



// export const requireRoleOrOwner = ({paramsId, roles}: {paramsId: string, roles: string[]}) => {
//     return (
//       req: Request,
//       res: Response,
//       next: NextFunction
//     ) => {
//       // console.log("req.currentUser", req.currentUser);
//       if (!req.currentUser) {
//         throw new NotAuthorizedError();
//       }

//       const currentUserId = req?.currentUser?.id;
//       const id = req.params[paramsId];

//       if (roles.length && roles.includes(req.currentUser.userType)) {
//         return next()
//       }

//       if( id !== currentUserId){
//         throw new NotAuthorizedError();
//       }
  
//       next();
//     };
//   }

