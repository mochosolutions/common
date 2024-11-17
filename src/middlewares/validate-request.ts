import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
// import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError  } from '../errors/bad-request-error';
import Validators from '../validators';

export const validateRequest = (validator: string) => {
  if(!Validators.hasOwnProperty(validator)){
    throw new Error(`'${validator}' validator does not exist`)
  }
  return async function(req: Request, res: Response, next: NextFunction) {
    try {
        const validated = await (Validators as any)[validator].validate({
          body: req.body,
          // query: req.query,
          params: req.params,
        },
        {
          stripUnknown: true
        });
        req.body = validated.body
        next()
    } catch (err: any) {
        console.error("Validation Error", err)
        //* Pass err to next
        //! If validation error occurs call next with HTTP 422. Otherwise HTTP 500
        // if(err.isJoi){
        //   // throw new RequestValidationError([{"msg": "omg",  param: "param"}])
        //   throw new BadRequestError("Joi Validation Broken")
        // }

        throw new BadRequestError("Validation not working...")
    }
}
 
}