require("dotenv").config();
const AWS = require("aws-sdk");
const path = require("path");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadImageToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}_${path.basename(file.originalname)}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const data = await s3.upload(params).promise();
  return data.Location;
};
const deleteImageFromS3 = async (fileKey) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, 
    Key: fileKey, 
  };

  try {
    const data = await s3.deleteObject(params).promise();
    console.log(`File deleted successfully: ${fileKey}`);
    return data;
  } catch (err) {
    console.error(`Error deleting file: ${fileKey}`, err);
    throw err;
  }
};
module.exports = { uploadImageToS3, deleteImageFromS3 };
