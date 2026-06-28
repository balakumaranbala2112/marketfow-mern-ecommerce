import env from "../config/env.js";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";

import AppError from "../utils/AppError.js";
import StatusCodes from "../constants/statusCodes.js";

function ensureCloudinaryConfigured() {
  if (!isCloudinaryConfigured()) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Cloudinary is not configured",
    );
  }
}

function uploadBufferToCloudinary(fileBuffer, options = {}) {
  ensureCloudinaryConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: env.cloudinary.productFolder,
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
}

async function uploadProductImageFile(file, productId) {
  const result = await uploadBufferToCloudinary(file.buffer, {
    public_id: `${productId}-${Date.now()}`,
    overwrite: false,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    alt: file.originalname,
  };
}

async function deleteImageFromCloudinary(publicId) {
  ensureCloudinaryConfigured();

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
}

async function deleteManyImagesFromCloudinary(publicIds) {
  const results = [];

  for (const publicId of publicIds) {
    const result = await deleteImageFromCloudinary(publicId);

    results.push({
      publicId,
      result,
    });
  }

  return results;
}

export {
  uploadProductImageFile,
  deleteImageFromCloudinary,
  deleteManyImagesFromCloudinary,
};
