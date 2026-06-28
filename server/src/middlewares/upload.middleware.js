import multer from "multer";

import AppError from "../utils/AppError.js";
import StatusCodes from "../constants/statusCodes.js";

const allowedImageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const storage = multer.memoryStorage();

function imageFileFilter(req, file, cb) {
  if (!allowedImageMimeTypes.includes(file.mimetype)) {
    return cb(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Only jpeg, jpg, png, and webp images are allowed",
      ),
    );
  }

  cb(null, true);
}

const uploadProductImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 5,
  },
});

export { uploadProductImages };
