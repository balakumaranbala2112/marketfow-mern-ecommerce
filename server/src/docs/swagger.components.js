const swaggerComponents = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },

  schemas: {
    ApiSuccess: {
      type: "object",
      properties: {
        success: {
          type: "boolean",
          example: true,
        },
        message: {
          type: "string",
          example: "Request completed successfully",
        },
        data: {
          type: "object",
        },
      },
    },

    ApiError: {
      type: "object",
      properties: {
        success: {
          type: "boolean",
          example: false,
        },
        status: {
          type: "string",
          example: "fail",
        },
        message: {
          type: "string",
          example: "Validation failed",
        },
        errors: {
          type: "array",
          items: {
            type: "string",
          },
          example: ["Email is required"],
        },
      },
    },

    User: {
      type: "object",
      properties: {
        _id: {
          type: "string",
          example: "64f1c2a7b0c4a2f123456789",
        },
        name: {
          type: "string",
          example: "Balakumaran",
        },
        email: {
          type: "string",
          example: "bk@example.com",
        },
        role: {
          type: "string",
          example: "customer",
        },
        phone: {
          type: "string",
          example: "9876543210",
        },
        avatar: {
          type: "object",
          properties: {
            url: {
              type: "string",
              example: "https://res.cloudinary.com/demo/avatar.jpg",
            },
            publicId: {
              type: "string",
              example: "marketflow/avatars/user-id",
            },
            alt: {
              type: "string",
              example: "profile.png",
            },
          },
        },
        isBlocked: {
          type: "boolean",
          example: false,
        },
      },
    },

    Category: {
      type: "object",
      properties: {
        _id: {
          type: "string",
          example: "64f1c2a7b0c4a2f123456789",
        },
        name: {
          type: "string",
          example: "Electronics",
        },
        slug: {
          type: "string",
          example: "electronics",
        },
        description: {
          type: "string",
          example: "Electronic products and gadgets",
        },
        image: {
          type: "object",
          properties: {
            url: {
              type: "string",
              example: "https://res.cloudinary.com/demo/category.jpg",
            },
            publicId: {
              type: "string",
              example: "marketflow/categories/category-id",
            },
            alt: {
              type: "string",
              example: "electronics.png",
            },
          },
        },
        isActive: {
          type: "boolean",
          example: true,
        },
      },
    },

    ProductImage: {
      type: "object",
      properties: {
        url: {
          type: "string",
          example: "https://res.cloudinary.com/demo/product.jpg",
        },
        publicId: {
          type: "string",
          example: "marketflow/products/product-id",
        },
        alt: {
          type: "string",
          example: "mouse.png",
        },
      },
    },

    Product: {
      type: "object",
      properties: {
        _id: {
          type: "string",
          example: "64f1c2a7b0c4a2f123456789",
        },
        name: {
          type: "string",
          example: "Wireless Mouse",
        },
        slug: {
          type: "string",
          example: "wireless-mouse",
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
        images: {
          type: "array",
          items: {
            $ref: "#/components/schemas/ProductImage",
          },
        },
        stock: {
          type: "number",
          example: 20,
        },
        sku: {
          type: "string",
          example: "MOUSE-001",
        },
        ratingsAverage: {
          type: "number",
          example: 4.5,
        },
        ratingsCount: {
          type: "number",
          example: 12,
        },
        isActive: {
          type: "boolean",
          example: true,
        },
        isFeatured: {
          type: "boolean",
          example: false,
        },
      },
    },

    CartItem: {
      type: "object",
      properties: {
        _id: {
          type: "string",
          example: "64f1c2a7b0c4a2f123456789",
        },
        product: {
          type: "string",
          example: "64f1c2a7b0c4a2f123456789",
        },
        name: {
          type: "string",
          example: "Wireless Mouse",
        },
        image: {
          type: "string",
          example: "https://res.cloudinary.com/demo/product.jpg",
        },
        price: {
          type: "number",
          example: 799,
        },
        quantity: {
          type: "number",
          example: 2,
        },
        stock: {
          type: "number",
          example: 20,
        },
        subtotal: {
          type: "number",
          example: 1598,
        },
      },
    },

    Cart: {
      type: "object",
      properties: {
        _id: {
          type: "string",
          example: "64f1c2a7b0c4a2f123456789",
        },
        user: {
          type: "string",
          example: "64f1c2a7b0c4a2f123456789",
        },
        items: {
          type: "array",
          items: {
            $ref: "#/components/schemas/CartItem",
          },
        },
        totalItems: {
          type: "number",
          example: 2,
        },
        cartTotal: {
          type: "number",
          example: 1598,
        },
        discountPrice: {
          type: "number",
          example: 100,
        },
        payableTotal: {
          type: "number",
          example: 1498,
        },
      },
    },

    ShippingAddress: {
      type: "object",
      required: [
        "fullName",
        "phone",
        "addressLine1",
        "city",
        "state",
        "postalCode",
        "country",
      ],
      properties: {
        fullName: {
          type: "string",
          example: "Balakumaran K",
        },
        phone: {
          type: "string",
          example: "9876543210",
        },
        addressLine1: {
          type: "string",
          example: "No 10, Main Road",
        },
        addressLine2: {
          type: "string",
          example: "Near Bus Stand",
        },
        city: {
          type: "string",
          example: "Chennai",
        },
        state: {
          type: "string",
          example: "Tamil Nadu",
        },
        postalCode: {
          type: "string",
          example: "600001",
        },
        country: {
          type: "string",
          example: "India",
        },
      },
    },

    Order: {
      type: "object",
      properties: {
        _id: {
          type: "string",
          example: "64f1c2a7b0c4a2f123456789",
        },
        user: {
          type: "string",
          example: "64f1c2a7b0c4a2f123456789",
        },
        orderStatus: {
          type: "string",
          example: "pending",
        },
        paymentMethod: {
          type: "string",
          example: "cod",
        },
        paymentStatus: {
          type: "string",
          example: "pending",
        },
        itemsPrice: {
          type: "number",
          example: 1598,
        },
        shippingPrice: {
          type: "number",
          example: 50,
        },
        taxPrice: {
          type: "number",
          example: 0,
        },
        discountPrice: {
          type: "number",
          example: 100,
        },
        totalPrice: {
          type: "number",
          example: 1548,
        },
      },
    },
  },

  responses: {
    UnauthorizedError: {
      description: "Authentication token is missing or invalid",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ApiError",
          },
        },
      },
    },

    ForbiddenError: {
      description: "User does not have permission",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ApiError",
          },
        },
      },
    },

    ValidationError: {
      description: "Validation failed",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ApiError",
          },
        },
      },
    },

    NotFoundError: {
      description: "Resource not found",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ApiError",
          },
        },
      },
    },
  },
};

export default swaggerComponents;
