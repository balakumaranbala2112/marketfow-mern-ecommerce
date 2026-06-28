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

function buildImageObject(result, file) {
  return {
    url: result.secure_url,
    publicId: result.public_id,
    alt: file.originalname,
  };
}

async function uploadProductImageFile(file, productId) {
  const result = await uploadBufferToCloudinary(file.buffer, {
    folder: env.cloudinary.productFolder,
    public_id: `${productId}-${Date.now()}`,
    overwrite: false,
  });

  return buildImageObject(result, file);
}

async function uploadCategoryImageFile(file, categoryId) {
  const result = await uploadBufferToCloudinary(file.buffer, {
    folder: env.cloudinary.categoryFolder,
    public_id: `${categoryId}-${Date.now()}`,
    overwrite: false,
  });

  return buildImageObject(result, file);
}

async function uploadUserAvatarFile(file, userId) {
  const result = await uploadBufferToCloudinary(file.buffer, {
    folder: env.cloudinary.avatarFolder,
    public_id: `${userId}-${Date.now()}`,
    overwrite: false,
  });

  return buildImageObject(result, file);
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
  uploadCategoryImageFile,
  uploadUserAvatarFile,
  deleteImageFromCloudinary,
  deleteManyImagesFromCloudinary,
};
