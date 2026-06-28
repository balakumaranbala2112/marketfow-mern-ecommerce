import { v2 as cloudinary } from "cloudinary";

import env from "./env.js";

function configureCloudinary() {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });

  return cloudinary;
}

function isCloudinaryConfigured() {
  return Boolean(
    env.cloudinary.cloudName &&
    env.cloudinary.apiKey &&
    env.cloudinary.apiSecret,
  );
}

const configuredCloudinary = configureCloudinary();

export { configuredCloudinary as cloudinary, isCloudinaryConfigured };
