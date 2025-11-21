import multer from "multer";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

const uploadDir = path.join(__dirname, "..", "..", "public", "avatars");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const rand = nanoid(10);
        const ext = path.extname(file.originalname);
        cb(null, `${rand}${ext}`);
    },
});

export const upload = multer({ storage });
