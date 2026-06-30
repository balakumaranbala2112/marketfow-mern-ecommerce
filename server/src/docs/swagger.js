import swaggerJSDoc from "swagger-jsdoc";

import env from "../config/env.js";
import swaggerComponents from "./swagger.components.js";
import swaggerPaths from "./swagger.paths.js";

const swaggerDefinition = {
  openapi: "3.0.0",

  info: {
    title: "MarketFlow MERN E-Commerce API",
    version: "1.0.0",
    description: "API documentation for MarketFlow MERN E-Commerce backend.",
  },

  servers: [
    {
      url: `http://localhost:${env.port}`,
      description: "Local development server",
    },
    {
      url: "/",
      description: "Current environment host",
    },
  ],

  tags: [
    {
      name: "Auth",
      description: "Authentication and password reset APIs",
    },
    {
      name: "Users",
      description: "User profile and account APIs",
    },
    {
      name: "Products",
      description: "Product browsing and admin product APIs",
    },
    {
      name: "Categories",
      description: "Category APIs",
    },
    {
      name: "Cart",
      description: "Shopping cart APIs",
    },
    {
      name: "Orders",
      description: "Customer and admin order APIs",
    },
    {
      name: "Reviews",
      description: "Product review APIs",
    },
    {
      name: "Wishlist",
      description: "Wishlist APIs",
    },
    {
      name: "Coupons",
      description: "Coupon APIs",
    },
    {
      name: "Payments",
      description: "Razorpay payment APIs",
    },
    {
      name: "Uploads",
      description: "Image upload APIs",
    },
    {
      name: "Admin",
      description: "Admin-only APIs",
    },
  ],

  components: swaggerComponents,

  paths: swaggerPaths,
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
