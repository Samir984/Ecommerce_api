import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);

cloudinary.config({
  cloud_name: process.env.COUDINARY_NAME,
  api_key: process.env.COUDINARY_KEY,
  api_secret: process.env.COUDINARY_SECRET,
});

const uploadImageOnCloudinary = async function (fileBuffer, folder) {
  try {
    if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
      throw new Error("Invalid file buffer");
    }

    // Write the buffer to a temporary file
    const tempFilePath = `/tmp/${Date.now()}.jpg`; // Example: Save as a JPEG file
    await writeFileAsync(tempFilePath, fileBuffer);

    // Upload the temporary file to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: "auto",
      folder,
    });

    // Delete the temporary file after uploading to Cloudinary
    fs.unlinkSync(tempFilePath);

    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

const deleteAssetFromCloudinary = async function (public_id, resource_type = "image") {
  try {
    if (!public_id) {
      throw new Error("Missing public_id");
    }

    // Delete file from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });

    return result;
  } catch (error) {
    console.error("Error deleting asset from Cloudinary:", error);
    throw error;
  }
};

export { uploadImageOnCloudinary, deleteAssetFromCloudinary };
