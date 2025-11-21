const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

function videoUpload(req, res, next) {
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 }, // allow image through
  ])(req, res, function (err) {
    console.log("=== VIDEO MIDDLEWARE DEBUG ===");
    console.log("err:", err);
    console.log("req.files:", req.files);
    console.log("==============================");

    if (err) {
      return res.status(400).json({
        type: "error",
        message: "Video upload failed",
      });
    }

    // save only video file
    req.videoFile = req.files?.video ? req.files.video[0] : null;

    // let image pass through untouched
    next();
  });
}

module.exports = videoUpload;
