const cloudinary = require("cloudinary").v2;

async function uploadImage(req, res, next) {
  try {
    const imageFile = req.files?.image ? req.files.image[0] : null;

    if (!imageFile) {
      return res.status(400).json({
        type: "error",
        message: "Image upload failed",
      });
    }

    // Cloudinary upload using buffer
    cloudinary.uploader
      .upload_stream(
        {
          folder: "instamato-food-items",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error);
            return res.status(400).json({
              type: "error",
              message: "Image upload failed",
            });
          }

          req.imageFile = result; // Cloudinary upload result

          next();
        }
      )
      .end(imageFile.buffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      type: "error",
      message: "Image upload failed",
    });
  }
}

module.exports = uploadImage;
