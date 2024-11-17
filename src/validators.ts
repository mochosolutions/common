import * as Yup from "yup";
// import { JobLocationTypes, JobStatusTypes, JobTypes, UserTypes } from "../types"
// // import { isValidObjectId  } from 'mongoose';

export const signinValidator = Yup.object({
    body: Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
    })
})


// export const passwordResetValidator = Yup.object({
//     body: Yup.object({
//         email: Yup.string().email().required(),
//     })
// })

// export const validatePasswordResetValidator = Yup.object({
//     body: Yup.object({
//         token: Yup.string().required(),
//         // userId: Yup.string().required(),
//     })
// })

// export const inviteUserValidator = Yup.object({
//     body: Yup.object().shape({
//         // firstName: Yup.string().required().trim(),
//         // lastName: Yup.string().required().trim(),
//         email: Yup.string().email().required().trim(),
//         password: Yup.string().min(8).required().trim(),
//         role: Yup.string().oneOf([UserTypes.ADMIN, UserTypes.RECRUITER]).required().trim(),
//     })
// })


// export const signUpAccountValidator = Yup.object({
//     body: Yup.object({
//         firstName: Yup.string().required().trim(),
//         lastName: Yup.string().required().trim(),
//         email: Yup.string().email().required().trim(),
//         password: Yup.string().required().trim(),
//         token: Yup.string().required().trim(),
//         userType: Yup.string().oneOf([UserTypes.ADMIN, UserTypes.RECRUITER, UserTypes.CANDIDATE, UserTypes.CANDIDATE]).required().trim(),
//     }),
// })



// export const createTeamValidator = Yup.object({
//     body: Yup.object().shape({
//         firstName: Yup.string().required().trim(),
//         lastName: Yup.string().required().trim(),
//         email: Yup.string().email().required().trim(),
//         password: Yup.string().min(8).required().trim(),
//         name: Yup.string().required().trim(),
//         phoneNumber: Yup.string().trim(),
//     })
// })

// export const createJobCategoryValidator = Yup.object({
//     body: Yup.object().shape({
//         title: Yup.string().min(4).required('Title is required').trim(),
//         description: Yup.string().min(4).optional().trim(),
//         active: Yup.boolean().optional(),
//     })
// })


// export const createOrganizationValidator = Yup.object().shape({

//     body: Yup.object().shape({
//         name: Yup.string().required('Organization name is required'),
//         type: Yup.string().oneOf(['Agency', 'Company']).required('Organization type is required'),
//         description: Yup.string().required('Description is required'),
//         logo: Yup.string().url('Logo must be a valid URL').required('Logo URL is required'),
//         creator: Yup.number().required('Creator is required'),
//         owner: Yup.number().required('Owner is required'),
//         address: Yup.object().shape({
//             addressLine1: Yup.string().required('Address Line 1 is required'),
//             addressLine2: Yup.string().optional(),
//             state: Yup.string().required('State is required'),
//             city: Yup.string().required('City is required'),
//             country: Yup.string().required('Country is required'),
//             zipCode: Yup.string().required('Zip Code is required'),
//         }),
//         website: Yup.string().url('Website must be a valid URL').required('Website URL is required'),
//         // is_public: Yup.boolean().required('is_public field is required'),
//         // is_visible: Yup.boolean().required('is_visible field is required'),
//         custom_fields: Yup.object(),

//     })

// });

// export const editOrganizationValidator = Yup.object().shape({
//     body: Yup.object().shape({
//         name: Yup.string(),
//         type: Yup.string().oneOf(['Agency', 'Company']),
//         description: Yup.string(),
//         logo: Yup.string().url('Logo must be a valid URL'),
//         creator: Yup.number(),
//         owner: Yup.number(),
//         address: Yup.string(),
//         website: Yup.string().url('Website must be a valid URL'),
//         // is_public: Yup.boolean(),
//         // is_visible: Yup.boolean(),
//         custom_fields: Yup.object(),

//     })
// });

// export const createPipelineValidator = Yup.object({
//     body: Yup.object({
//         pipelineName: Yup.string().required().trim(),
//         pipelineDescription: Yup.string().required().trim(),
//         stages: Yup.array().of(
//             Yup.object().shape({
//                 name: Yup.string().required().trim(),
//                 description: Yup.string().required().trim(),
//                 position: Yup.number().required().integer().positive()
//             })
//         )
//         .required()
//         .min(1)
//         .test('unique-stage-names', 'Stage names must be unique', (stages) => {
//             const stageNames = stages.map((stage: any) => stage.name.toLowerCase());
//             return stageNames.length === new Set(stageNames).size;
//         })
//     })
// });


// // export const createDealValidator = Yup.object({
// //     body: Yup.object({
// //         opportunityId: Yup.string().required().trim().matches(/^[0-9a-fA-F]{24}$/),
// //         pipelineId: Yup.string().required().trim().matches(/^[0-9a-fA-F]{24}$/),
// //         stageId: Yup.string().required().trim().matches(/^[0-9a-fA-F]{24}$/),
// //         dealValue: Yup.number().optional().integer().positive(),
// //     })
// // });

// // const objectIdValidator = (value) => {
// //         if (!value) {
// //             return true; // Allow empty values
// //         }
// //         return isValidObjectId(value);
// // };

// // export { objectIdValidator };


// export const createDealValidator = Yup.object({
//     body: Yup.object({
//         opportunityId: Yup.string().required().trim().test('valid-object-id', 'Must be a valid Objectid', objectIdValidator),
//         pipelineId: Yup.string().required().trim().test('valid-object-id', 'Must be a valid Objectid', objectIdValidator),
//         stageId: Yup.string().required().trim().test('valid-object-id', 'Must be a valid Objectid', objectIdValidator),
//         ownerId: Yup.string().required().trim().test('valid-object-id', 'Must be a valid Objectid', objectIdValidator),
//         dealValue: Yup.number().optional().integer().positive(),
//     })
// });



export default {
    // signupValidator,
    signinValidator,
    // signUpAccountValidator,
    // inviteUserValidator,
    // createTeamValidator,
    // createJobCategoryValidator,
    // createOrganizationValidator,
    // editOrganizationValidator,
    // passwordResetValidator,
    // validatePasswordResetValidator,
    // createPipelineValidator,
    // createDealValidator,
}