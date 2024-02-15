import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises"; // For asynchronous version
const uploadFilePath = path.dirname(fileURLToPath(import.meta.url));
console.log(uploadFilePath);

readdir(uploadFilePath)
  .then((files) => {
    console.log("Files in the directory:");
    console.log(files);
  })
  .catch((error) => {
    console.error("Error reading directory:", error);
  });
export default uploadFilePath;
