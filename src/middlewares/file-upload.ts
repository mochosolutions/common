import multer from "multer";
import path from "path"

const maxSize = 2 * 1024 * 1024;

function fileFilter(req: any, file: any, cb: any) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;

    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}


// const storage = multer.diskStorage({
//     destination: "public/files",
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// })

const storage = multer.memoryStorage()

export const uploadFile = multer({
    storage,
    // fileFilter,
    // limits: { fileSize: maxSize },
})


// let uploadFileMiddleware = promisify(uploadFile);
// export default uploadFileMiddleware;