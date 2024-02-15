import multer from "multer";
import uploadFilePath from "../temp/mypath.js";
console.log(uploadFilePath);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFilePath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = file.originalname;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

export { upload };
