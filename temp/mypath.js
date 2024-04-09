import path from "path";
import { fileURLToPath } from "url";
const uploadFilePath = path.dirname(fileURLToPath(import.meta.url));
console.log(uploadFilePath);

export default uploadFilePath;
