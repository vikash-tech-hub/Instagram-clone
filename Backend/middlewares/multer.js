import multer from "multer";

const storage = multer.memoryStorage(); // store in memory for Cloudinary
const upload = multer({ storage });

export default upload;
