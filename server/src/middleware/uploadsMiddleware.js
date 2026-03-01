import multer from "multer";
import path from "path";
import fs from "fs";

// pastikan folder uploads ada
const uploadDir = path.join("public", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // <-- folder
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const allowTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowTypes.includes(file.mimetype)) {
            return cb(new Error("Only image are allowed"));
        }
        cb(null, true);
    },
});

export default upload;