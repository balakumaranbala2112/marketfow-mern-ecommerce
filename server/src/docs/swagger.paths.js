const swaggerPaths = {
  "/api/v1/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new customer",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: {
                  type: "string",
                  example: "Balakumaran",
                },
                email: {
                  type: "string",
                  example: "bk@example.com",
                },
                password: {
                  type: "string",
                  example: "Password123",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "User registered successfully",
        },
        400: {
          $ref: "#/components/responses/ValidationError",
        },
        409: {
          description: "Email already exists",
        },
      },
    },
  },

  "/api/v1/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  example: "bk@example.com",
                },
                password: {
                  type: "string",
                  example: "Password123",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
        },
        401: {
          description: "Invalid email or password",
        },
      },
    },
  },

  "/api/v1/auth/me": {
    get: {
      tags: ["Auth"],
      summary: "Get current logged-in user",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Current user fetched successfully",
        },
        401: {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    },
  },

  "/api/v1/auth/forgot-password": {
    post: {
      tags: ["Auth"],
      summary: "Request password reset email",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: {
                  type: "string",
                  example: "bk@example.com",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Generic reset link response",
        },
        400: {
          $ref: "#/components/responses/ValidationError",
        },
      },
    },
  },

  "/api/v1/auth/reset-password/{resetToken}": {
    post: {
      tags: ["Auth"],
      summary: "Reset password using reset token",
      parameters: [
        {
          in: "path",
          name: "resetToken",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["password", "confirmPassword"],
              properties: {
                password: {
                  type: "string",
                  example: "NewPassword123",
                },
                confirmPassword: {
                  type: "string",
                  example: "NewPassword123",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Password reset successfully",
        },
        400: {
          $ref: "#/components/responses/ValidationError",
        },
      },
    },
  },

  "/api/v1/products": {
    get: {
      tags: ["Products"],
      summary: "Get all products with search, filter, sort, pagination",
      parameters: [
        {
          in: "query",
          name: "search",
          schema: {
            type: "string",
          },
          example: "mouse",
        },
        {
          in: "query",
          name: "category",
          schema: {
            type: "string",
          },
        },
        {
          in: "query",
          name: "brand",
          schema: {
            type: "string",
          },
          example: "Logitech",
        },
        {
          in: "query",
          name: "minPrice",
          schema: {
            type: "number",
          },
          example: 500,
        },
        {
          in: "query",
          name: "maxPrice",
          schema: {
            type: "number",
          },
          example: 2000,
        },
        {
          in: "query",
          name: "sort",
          schema: {
            type: "string",
          },
          example: "price",
        },
        {
          in: "query",
          name: "page",
          schema: {
            type: "number",
          },
          example: 1,
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "number",
          },
          example: 10,
        },
      ],
      responses: {
        200: {
          description: "Products fetched successfully",
        },
      },
    },

    post: {
      tags: ["Products"],
      summary: "Create product admin only",
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "name",
                "description",
                "price",
                "category",
                "stock",
                "sku",
              ],
              properties: {
                name: {
                  type: "string",
                  example: "Wireless Mouse",
                },
                description: {
                  type: "string",
                  example: "High quality wireless mouse",
                },
                shortDescription: {
                  type: "string",
                  example: "Compact wireless mouse",
                },
                price: {
                  type: "number",
                  example: 999,
                },
                discountPrice: {
                  type: "number",
                  example: 799,
                },
                category: {
                  type: "string",
                  example: "64f1c2a7b0c4a2f123456789",
                },
                brand: {
                  type: "string",
                  example: "Logitech",
                },
                stock: {
                  type: "number",
                  example: 20,
                },
                sku: {
                  type: "string",
                  example: "MOUSE-001",
                },
                isFeatured: {
                  type: "boolean",
                  example: false,
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Product created successfully",
        },
        401: {
          $ref: "#/components/responses/UnauthorizedError",
        },
        403: {
          $ref: "#/components/responses/ForbiddenError",
        },
      },
    },
  },

  "/api/v1/products/{productId}": {
    get: {
      tags: ["Products"],
      summary: "Get single product by id",
      parameters: [
        {
          in: "path",
          name: "productId",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Product fetched successfully",
        },
        404: {
          $ref: "#/components/responses/NotFoundError",
        },
      },
    },

    put: {
      tags: ["Products"],
      summary: "Update product admin only",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productId",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Product updated successfully",
        },
        401: {
          $ref: "#/components/responses/UnauthorizedError",
        },
        403: {
          $ref: "#/components/responses/ForbiddenError",
        },
      },
    },

    delete: {
      tags: ["Products"],
      summary: "Delete product admin only",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productId",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Product deleted successfully",
        },
        401: {
          $ref: "#/components/responses/UnauthorizedError",
        },
        403: {
          $ref: "#/components/responses/ForbiddenError",
        },
      },
    },
  },

  "/api/v1/products/{productId}/images": {
    post: {
      tags: ["Uploads"],
      summary: "Upload product images admin only",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productId",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                images: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Product images uploaded successfully",
        },
      },
    },

    delete: {
      tags: ["Uploads"],
      summary: "Delete product image admin only",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productId",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["publicId"],
              properties: {
                publicId: {
                  type: "string",
                  example: "marketflow/products/product-id",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Product image deleted successfully",
        },
      },
    },
  },

  "/api/v1/cart": {
    get: {
      tags: ["Cart"],
      summary: "Get my cart",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Cart fetched successfully",
        },
        401: {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    },

    delete: {
      tags: ["Cart"],
      summary: "Clear my cart",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Cart cleared successfully",
        },
      },
    },
  },

  "/api/v1/cart/items": {
    post: {
      tags: ["Cart"],
      summary: "Add product to cart",
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["productId", "quantity"],
              properties: {
                productId: {
                  type: "string",
                  example: "64f1c2a7b0c4a2f123456789",
                },
                quantity: {
                  type: "number",
                  example: 2,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Product added to cart successfully",
        },
        401: {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    },
  },

  "/api/v1/cart/items/{cartItemId}": {
    put: {
      tags: ["Cart"],
      summary: "Update cart item quantity",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "cartItemId",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["quantity"],
              properties: {
                quantity: {
                  type: "number",
                  example: 3,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Cart item updated successfully",
        },
      },
    },

    delete: {
      tags: ["Cart"],
      summary: "Remove cart item",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "cartItemId",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Cart item removed successfully",
        },
      },
    },
  },

  "/api/v1/orders": {
    post: {
      tags: ["Orders"],
      summary: "Create COD order from cart",
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shippingAddress", "paymentMethod"],
              properties: {
                shippingAddress: {
                  $ref: "#/components/schemas/ShippingAddress",
                },
                paymentMethod: {
                  type: "string",
                  example: "cod",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Order created successfully",
        },
        401: {
          $ref: "#/components/responses/UnauthorizedError",
        },
      },
    },
  },

  "/api/v1/orders/my-orders": {
    get: {
      tags: ["Orders"],
      summary: "Get my orders",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "My orders fetched successfully",
        },
      },
    },
  },

  "/api/v1/orders/{orderId}": {
    get: {
      tags: ["Orders"],
      summary: "Get my single order",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "orderId",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Order fetched successfully",
        },
        404: {
          $ref: "#/components/responses/NotFoundError",
        },
      },
    },
  },

  "/api/v1/payments/razorpay/create-order": {
    post: {
      tags: ["Payments"],
      summary: "Create Razorpay order from cart",
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shippingAddress"],
              properties: {
                shippingAddress: {
                  $ref: "#/components/schemas/ShippingAddress",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Razorpay order created successfully",
        },
      },
    },
  },

  "/api/v1/payments/razorpay/verify": {
    post: {
      tags: ["Payments"],
      summary: "Verify Razorpay payment",
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "orderId",
                "razorpay_order_id",
                "razorpay_payment_id",
                "razorpay_signature",
              ],
              properties: {
                orderId: {
                  type: "string",
                  example: "64f1c2a7b0c4a2f123456789",
                },
                razorpay_order_id: {
                  type: "string",
                  example: "order_ABC123",
                },
                razorpay_payment_id: {
                  type: "string",
                  example: "pay_ABC123",
                },
                razorpay_signature: {
                  type: "string",
                  example: "signature",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Razorpay payment verified successfully",
        },
      },
    },
  },

  "/api/v1/users/profile": {
    get: {
      tags: ["Users"],
      summary: "Get my profile",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Profile fetched successfully",
        },
      },
    },

    put: {
      tags: ["Users"],
      summary: "Update my profile",
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "Balakumaran K",
                },
                phone: {
                  type: "string",
                  example: "9876543210",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Profile updated successfully",
        },
      },
    },
  },

  "/api/v1/users/avatar": {
    post: {
      tags: ["Uploads"],
      summary: "Upload my avatar",
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                avatar: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Avatar uploaded successfully",
        },
      },
    },

    delete: {
      tags: ["Uploads"],
      summary: "Delete my avatar",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Avatar deleted successfully",
        },
      },
    },
  },

  "/api/v1/dashboard/admin/summary": {
    get: {
      tags: ["Admin"],
      summary: "Get admin dashboard summary",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Admin dashboard summary fetched successfully",
        },
        403: {
          $ref: "#/components/responses/ForbiddenError",
        },
      },
    },
  },
};

export default swaggerPaths;
