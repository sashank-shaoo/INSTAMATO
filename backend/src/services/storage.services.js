const ImageKit = require("@imagekit/nodejs").default; // ✅ correct import
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadVideo(buffer, originalName = "video.mp4") {
  const tmpDir = path.join(__dirname, "../tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  const tmpFilePath = path.join(tmpDir, `${uuid()}-${originalName}`);

  try {
    fs.writeFileSync(tmpFilePath, buffer);

    const result = await imagekit.files.upload({
      
      file: fs.createReadStream(tmpFilePath),
      fileName: originalName,
      folder: "/food_videos_Instamato",
    });

    return result;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Video upload failed: " + error.message);
  } finally {
    if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath);
  }
}

module.exports = { uploadVideo };
