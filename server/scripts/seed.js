/**
 * ============================================================
 *  MarketFlow – Full Database Seed Script
 * ============================================================
 *
 *  Usage:
 *    npm run seed            – Insert seed data (skips if data already exists)
 *    npm run seed:fresh      – Drop all collections and re-seed from scratch
 *
 *  What it seeds:
 *    1. Users         – 1 admin  +  5 customers
 *    2. Categories    – 8 e-commerce categories
 *    3. Products      – 20 products across categories
 *    4. Coupons       – 4 coupons (percentage & fixed)
 *    5. Reviews       – Reviews on products from customers
 *    6. Wishlists     – Wishlists for each customer
 *    7. Carts         – A pre-filled cart for one customer
 *    8. Orders        – 4 orders in various statuses
 * ============================================================
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// ── Models ─────────────────────────────────────────────────
import User from "../src/models/user.model.js";
import Category from "../src/models/category.model.js";
import Product from "../src/models/product.model.js";
import Coupon from "../src/models/coupon.model.js";
import Review from "../src/models/review.model.js";
import Cart from "../src/models/cart.model.js";
import Wishlist from "../src/models/wishlist.model.js";
import Order from "../src/models/order.model.js";

// ── Helpers ────────────────────────────────────────────────
const isFresh = process.argv.includes("--fresh");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr, count = 1) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateSKU(prefix, index) {
  return `${prefix}-${String(index).padStart(4, "0")}`;
}

// ── Placeholder image helper (via placeholder services) ───
function placeholderImage(label, width = 600, height = 600) {
  const text = encodeURIComponent(label);
  return {
    url: `https://placehold.co/${width}x${height}/1a1a2e/eaeaea?text=${text}`,
    publicId: `seed/${slugify(label)}`,
    alt: label,
  };
}

// ============================================================
//  SEED DATA
// ============================================================

// ── 1. Users ───────────────────────────────────────────────
const usersData = [
  {
    name: "Admin User",
    email: "admin@marketflow.com",
    password: "Admin@1234",
    role: "admin",
    phone: "+91-9876543210",
    emailVerified: true,
  },
  {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    password: "Customer@123",
    role: "customer",
    phone: "+91-9876543211",
    emailVerified: true,
  },
  {
    name: "Priya Patel",
    email: "priya@example.com",
    password: "Customer@123",
    role: "customer",
    phone: "+91-9876543212",
    emailVerified: true,
  },
  {
    name: "Amit Kumar",
    email: "amit@example.com",
    password: "Customer@123",
    role: "customer",
    phone: "+91-9876543213",
    emailVerified: true,
  },
  {
    name: "Sneha Reddy",
    email: "sneha@example.com",
    password: "Customer@123",
    role: "customer",
    phone: "+91-9876543214",
    emailVerified: true,
  },
  {
    name: "Vikram Singh",
    email: "vikram@example.com",
    password: "Customer@123",
    role: "customer",
    phone: "+91-9876543215",
    emailVerified: false,
  },
];

// ── 2. Categories ──────────────────────────────────────────
const categoriesData = [
  {
    name: "Electronics",
    description:
      "Smartphones, laptops, headphones, and other electronic gadgets.",
    isActive: true,
  },
  {
    name: "Fashion",
    description:
      "Trendy clothing, footwear, and accessories for men and women.",
    isActive: true,
  },
  {
    name: "Home & Kitchen",
    description:
      "Appliances, cookware, and home décor essentials for every room.",
    isActive: true,
  },
  {
    name: "Books",
    description:
      "Bestselling fiction, non-fiction, academic, and self-help books.",
    isActive: true,
  },
  {
    name: "Sports & Fitness",
    description:
      "Gym equipment, sportswear, and fitness accessories for an active life.",
    isActive: true,
  },
  {
    name: "Beauty & Personal Care",
    description:
      "Skincare, haircare, makeup, and grooming products for everyone.",
    isActive: true,
  },
  {
    name: "Toys & Games",
    description:
      "Fun and educational toys, board games, and outdoor play sets.",
    isActive: true,
  },
  {
    name: "Groceries",
    description:
      "Fresh produce, pantry staples, snacks, and daily essentials.",
    isActive: false, // inactive category for testing
  },
];

// ── 3. Products (will be filled with category refs later) ──
function buildProducts(categoryMap, adminId) {
  const products = [
    // -- Electronics --
    {
      name: "iPhone 15 Pro Max 256GB",
      description:
        "The most powerful iPhone ever with A17 Pro chip, titanium design, and a 48MP camera system. Features USB-C, Action button, and all-day battery life.",
      shortDescription: "A17 Pro chip, 48MP camera, titanium design",
      price: 159900,
      discountPrice: 149900,
      category: categoryMap["Electronics"],
      brand: "Apple",
      stock: 50,
      isFeatured: true,
      specifications: [
        { key: "Display", value: '6.7" Super Retina XDR OLED' },
        { key: "Processor", value: "A17 Pro" },
        { key: "RAM", value: "8 GB" },
        { key: "Storage", value: "256 GB" },
        { key: "Battery", value: "4422 mAh" },
      ],
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      description:
        "Galaxy AI powered smartphone featuring a built-in S Pen, 200MP camera, Snapdragon 8 Gen 3 processor, and a stunning 6.8-inch Dynamic AMOLED display.",
      shortDescription: "Galaxy AI, 200MP camera, S Pen included",
      price: 134999,
      discountPrice: 124999,
      category: categoryMap["Electronics"],
      brand: "Samsung",
      stock: 35,
      isFeatured: true,
      specifications: [
        { key: "Display", value: '6.8" Dynamic AMOLED 2X' },
        { key: "Processor", value: "Snapdragon 8 Gen 3" },
        { key: "RAM", value: "12 GB" },
        { key: "Storage", value: "256 GB" },
      ],
    },
    {
      name: "Sony WH-1000XM5 Headphones",
      description:
        "Industry-leading noise cancelling over-ear headphones with exceptional sound quality, 30-hour battery life, and crystal-clear hands-free calling.",
      shortDescription: "Best-in-class ANC, 30-hour battery",
      price: 29990,
      discountPrice: 24990,
      category: categoryMap["Electronics"],
      brand: "Sony",
      stock: 120,
      isFeatured: true,
      specifications: [
        { key: "Driver", value: "30mm" },
        { key: "Battery Life", value: "30 hours" },
        { key: "Noise Cancelling", value: "Yes – Adaptive" },
        { key: "Weight", value: "250g" },
      ],
    },
    {
      name: "MacBook Air M3 13-inch",
      description:
        "Supercharged by M3 chip. Strikingly thin design with a brilliant Liquid Retina display, up to 18 hours of battery life, and fanless silent operation.",
      shortDescription: "M3 chip, 18-hour battery, fanless design",
      price: 114900,
      discountPrice: null,
      category: categoryMap["Electronics"],
      brand: "Apple",
      stock: 25,
      isFeatured: false,
      specifications: [
        { key: "Processor", value: "Apple M3" },
        { key: "RAM", value: "8 GB" },
        { key: "Storage", value: "256 GB SSD" },
        { key: "Display", value: '13.6" Liquid Retina' },
      ],
    },

    // -- Fashion --
    {
      name: "Classic Fit Oxford Shirt",
      description:
        "Premium cotton Oxford shirt with a classic fit, button-down collar, and chest pocket. Perfect for both casual and semi-formal occasions. Machine washable.",
      shortDescription: "Premium cotton, classic fit, versatile style",
      price: 2499,
      discountPrice: 1799,
      category: categoryMap["Fashion"],
      brand: "Raymond",
      stock: 200,
      isFeatured: false,
      specifications: [
        { key: "Material", value: "100% Cotton" },
        { key: "Fit", value: "Classic" },
        { key: "Collar", value: "Button-down" },
        { key: "Care", value: "Machine washable" },
      ],
    },
    {
      name: "Men's Running Sneakers Pro",
      description:
        "Lightweight performance running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole. Designed for long-distance comfort.",
      shortDescription: "Lightweight, responsive cushioning",
      price: 5999,
      discountPrice: 4499,
      category: categoryMap["Fashion"],
      brand: "Nike",
      stock: 150,
      isFeatured: true,
      specifications: [
        { key: "Upper", value: "Breathable Mesh" },
        { key: "Sole", value: "Rubber" },
        { key: "Weight", value: "280g" },
        { key: "Closure", value: "Lace-up" },
      ],
    },
    {
      name: "Women's Silk Saree – Royal Blue",
      description:
        "Handwoven Kanchipuram silk saree in royal blue with gold zari border. Comes with matching blouse piece. Perfect for weddings and festive occasions.",
      shortDescription: "Handwoven Kanchipuram silk, gold zari",
      price: 12999,
      discountPrice: 10999,
      category: categoryMap["Fashion"],
      brand: "Kanchipuram Silks",
      stock: 30,
      isFeatured: true,
      specifications: [
        { key: "Material", value: "Pure Silk" },
        { key: "Length", value: "6.3 meters" },
        { key: "Blouse Piece", value: "Included" },
        { key: "Weave", value: "Handwoven" },
      ],
    },

    // -- Home & Kitchen --
    {
      name: "Instant Pot Duo 7-in-1 Cooker",
      description:
        "Multi-functional electric pressure cooker that works as a pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. 6-quart capacity.",
      shortDescription: "7-in-1, 6-quart capacity",
      price: 8999,
      discountPrice: 6999,
      category: categoryMap["Home & Kitchen"],
      brand: "Instant Pot",
      stock: 80,
      isFeatured: true,
      specifications: [
        { key: "Capacity", value: "6 Quart" },
        { key: "Functions", value: "7-in-1" },
        { key: "Power", value: "1000W" },
        { key: "Material", value: "Stainless Steel" },
      ],
    },
    {
      name: "Dyson V15 Detect Vacuum",
      description:
        "Intelligent cordless vacuum with laser dust detection, piezo sensor, and powerful suction. Reveals microscopic dust you cannot normally see. Up to 60 min runtime.",
      shortDescription: "Laser detection, 60-min runtime",
      price: 54990,
      discountPrice: 49990,
      category: categoryMap["Home & Kitchen"],
      brand: "Dyson",
      stock: 20,
      isFeatured: false,
      specifications: [
        { key: "Suction Power", value: "240 AW" },
        { key: "Runtime", value: "Up to 60 min" },
        { key: "Bin Volume", value: "0.76L" },
        { key: "Weight", value: "3.1 kg" },
      ],
    },
    {
      name: "Ceramic Non-Stick Cookware Set",
      description:
        "10-piece ceramic non-stick cookware set including frying pans, saucepans, and a dutch oven. PFOA-free, dishwasher safe, and oven safe up to 450°F.",
      shortDescription: "10-piece set, PFOA-free, dishwasher safe",
      price: 7499,
      discountPrice: 5999,
      category: categoryMap["Home & Kitchen"],
      brand: "Prestige",
      stock: 60,
      isFeatured: false,
      specifications: [
        { key: "Pieces", value: "10" },
        { key: "Coating", value: "Ceramic Non-Stick" },
        { key: "Oven Safe", value: "Up to 450°F" },
        { key: "Dishwasher Safe", value: "Yes" },
      ],
    },

    // -- Books --
    {
      name: "Atomic Habits by James Clear",
      description:
        "An easy and proven way to build good habits and break bad ones. James Clear reveals practical strategies to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
      shortDescription: "Build better habits, transform your life",
      price: 599,
      discountPrice: 399,
      category: categoryMap["Books"],
      brand: "Penguin",
      stock: 500,
      isFeatured: true,
      specifications: [
        { key: "Author", value: "James Clear" },
        { key: "Pages", value: "320" },
        { key: "Language", value: "English" },
        { key: "Format", value: "Paperback" },
      ],
    },
    {
      name: "The Psychology of Money",
      description:
        "Timeless lessons on wealth, greed, and happiness by Morgan Housel. 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life's most important topics.",
      shortDescription: "Timeless money lessons by Morgan Housel",
      price: 499,
      discountPrice: 349,
      category: categoryMap["Books"],
      brand: "Jaico Publishing",
      stock: 350,
      isFeatured: false,
      specifications: [
        { key: "Author", value: "Morgan Housel" },
        { key: "Pages", value: "256" },
        { key: "Language", value: "English" },
        { key: "Format", value: "Paperback" },
      ],
    },

    // -- Sports & Fitness --
    {
      name: "Adjustable Dumbbell Set 24kg",
      description:
        "Space-saving adjustable dumbbell set that replaces 15 sets of weights. Quick-change mechanism lets you switch from 2.5kg to 24kg in seconds. Durable steel construction with comfortable grip.",
      shortDescription: "2.5–24kg, quick-change, space-saving",
      price: 14999,
      discountPrice: 12499,
      category: categoryMap["Sports & Fitness"],
      brand: "Bowflex",
      stock: 40,
      isFeatured: true,
      specifications: [
        { key: "Weight Range", value: "2.5kg – 24kg" },
        { key: "Material", value: "Steel" },
        { key: "Adjustable", value: "Yes – Dial system" },
      ],
    },
    {
      name: "Yoga Mat – Premium 6mm",
      description:
        "Extra thick 6mm eco-friendly yoga mat with superior grip and cushioning. Made from TPE material, free from PVC, latex, and harmful chemicals. Includes carry strap.",
      shortDescription: "6mm thick, eco-friendly TPE, carry strap",
      price: 1999,
      discountPrice: 1499,
      category: categoryMap["Sports & Fitness"],
      brand: "Boldfit",
      stock: 300,
      isFeatured: false,
      specifications: [
        { key: "Thickness", value: "6mm" },
        { key: "Material", value: "TPE (Eco-friendly)" },
        { key: "Size", value: '72" x 24"' },
        { key: "Includes", value: "Carry Strap" },
      ],
    },
    {
      name: "Smart Fitness Band Pro",
      description:
        "Advanced fitness tracker with AMOLED display, heart rate monitor, SpO2 tracking, sleep analysis, and 14-day battery life. Water resistant up to 50 meters.",
      shortDescription: "AMOLED display, SpO2, 14-day battery",
      price: 4999,
      discountPrice: 3999,
      category: categoryMap["Sports & Fitness"],
      brand: "Xiaomi",
      stock: 180,
      isFeatured: true,
      specifications: [
        { key: "Display", value: '1.62" AMOLED' },
        { key: "Battery", value: "14 days" },
        { key: "Water Resistance", value: "5 ATM" },
        { key: "Sensors", value: "Heart rate, SpO2, Accelerometer" },
      ],
    },

    // -- Beauty & Personal Care --
    {
      name: "Vitamin C Serum – 30ml",
      description:
        "Brightening face serum with 20% Vitamin C, Hyaluronic Acid, and Vitamin E. Reduces dark spots, evens skin tone, and boosts collagen production. Suitable for all skin types.",
      shortDescription: "20% Vitamin C, brightening & anti-aging",
      price: 899,
      discountPrice: 649,
      category: categoryMap["Beauty & Personal Care"],
      brand: "Minimalist",
      stock: 400,
      isFeatured: true,
      specifications: [
        { key: "Volume", value: "30ml" },
        { key: "Key Ingredient", value: "20% Vitamin C" },
        { key: "Skin Type", value: "All" },
        { key: "Paraben Free", value: "Yes" },
      ],
    },
    {
      name: "Hair Dryer Professional 2200W",
      description:
        "Salon-grade professional hair dryer with ionic technology, 3 heat settings, 2 speed settings, and a concentrator nozzle. Reduces frizz and drying time by 50%.",
      shortDescription: "2200W, ionic technology, anti-frizz",
      price: 3499,
      discountPrice: 2799,
      category: categoryMap["Beauty & Personal Care"],
      brand: "Philips",
      stock: 90,
      isFeatured: false,
      specifications: [
        { key: "Power", value: "2200W" },
        { key: "Technology", value: "Ionic" },
        { key: "Heat Settings", value: "3" },
        { key: "Attachments", value: "Concentrator nozzle" },
      ],
    },

    // -- Toys & Games --
    {
      name: "LEGO Creator 3-in-1 Space Shuttle",
      description:
        "Build a space shuttle, an astronaut figure, or a spaceship with this 3-in-1 LEGO Creator set. 486 pieces with detailed instructions. Suitable for ages 8+.",
      shortDescription: "3-in-1 build, 486 pieces, ages 8+",
      price: 4999,
      discountPrice: 3999,
      category: categoryMap["Toys & Games"],
      brand: "LEGO",
      stock: 70,
      isFeatured: true,
      specifications: [
        { key: "Pieces", value: "486" },
        { key: "Age", value: "8+" },
        { key: "Builds", value: "3-in-1" },
        { key: "Theme", value: "Space" },
      ],
    },
    {
      name: "Chess Set – Wooden Premium",
      description:
        "Handcrafted premium wooden chess set with Sheesham and Boxwood pieces. Folding board doubles as a storage case. Weighted and felted pieces for smooth play.",
      shortDescription: "Handcrafted Sheesham wood, folding board",
      price: 2999,
      discountPrice: 2499,
      category: categoryMap["Toys & Games"],
      brand: "Chessbazaar",
      stock: 55,
      isFeatured: false,
      specifications: [
        { key: "Material", value: "Sheesham & Boxwood" },
        { key: "Board Size", value: '16"' },
        { key: "Weighted", value: "Yes" },
        { key: "Storage", value: "Folding board" },
      ],
    },
  ];

  return products.map((p, idx) => ({
    ...p,
    slug: slugify(p.name),
    sku: generateSKU(slugify(p.brand || "MF").substring(0, 4).toUpperCase(), idx + 1),
    images: [placeholderImage(p.name.substring(0, 20))],
    createdBy: adminId,
  }));
}

// ── 4. Coupons ─────────────────────────────────────────────
function buildCoupons(adminId) {
  const now = new Date();
  const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  return [
    {
      code: "WELCOME10",
      description: "10% off on your first order – welcome to MarketFlow!",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 500,
      maxDiscountAmount: 2000,
      usageLimit: 1000,
      usedCount: 0,
      startsAt: now,
      expiresAt: threeMonthsLater,
      isActive: true,
      createdBy: adminId,
    },
    {
      code: "FLAT500",
      description: "Flat ₹500 off on orders above ₹3,000.",
      discountType: "fixed",
      discountValue: 500,
      minOrderAmount: 3000,
      maxDiscountAmount: null,
      usageLimit: 500,
      usedCount: 12,
      startsAt: now,
      expiresAt: oneMonthLater,
      isActive: true,
      createdBy: adminId,
    },
    {
      code: "SUMMER25",
      description: "25% off on summer collection – limited time!",
      discountType: "percentage",
      discountValue: 25,
      minOrderAmount: 1000,
      maxDiscountAmount: 5000,
      usageLimit: 200,
      usedCount: 45,
      startsAt: now,
      expiresAt: oneMonthLater,
      isActive: true,
      createdBy: adminId,
    },
    {
      code: "EXPIRED20",
      description: "This coupon has already expired (for testing).",
      discountType: "percentage",
      discountValue: 20,
      minOrderAmount: 0,
      maxDiscountAmount: null,
      usageLimit: 100,
      usedCount: 100,
      startsAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      isActive: false,
      createdBy: adminId,
    },
  ];
}

// ── 5. Reviews ─────────────────────────────────────────────
const reviewComments = [
  "Absolutely love this product! Exceeded my expectations in every way.",
  "Great value for the price. Would definitely recommend to friends and family.",
  "Good quality but delivery took a bit longer than expected. Product itself is solid.",
  "Fantastic product! The build quality is premium and it looks even better in person.",
  "Decent product for the price point. Does exactly what it says on the box.",
  "Amazing quality! Five stars without hesitation. Will buy again.",
  "The product is okay but could be improved. Packaging was excellent though.",
  "Perfect gift for my family. They absolutely loved it. Great purchase!",
  "Super smooth experience from ordering to delivery. Product works flawlessly.",
  "Not bad but I expected a bit more for this price range. Still usable.",
];

// ============================================================
//  MAIN SEED FUNCTION
// ============================================================

async function seed() {
  try {
    // ── Connect ────────────────────────────────────────────
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/marketflow_dev";
    await mongoose.connect(mongoUri);
    console.log(`✅  Connected to MongoDB: ${mongoUri}`);

    // ── Fresh mode: drop everything ────────────────────────
    if (isFresh) {
      console.log("🗑️   --fresh flag detected. Dropping all collections...");
      const collections = [
        User,
        Category,
        Product,
        Coupon,
        Review,
        Cart,
        Wishlist,
        Order,
      ];
      for (const Model of collections) {
        await Model.deleteMany({});
      }
      console.log("    All collections cleared.\n");
    }

    // ── 1. Seed Users ──────────────────────────────────────
    console.log("👤  Seeding users...");
    const existingUsers = await User.countDocuments();
    let users;

    if (existingUsers > 0 && !isFresh) {
      console.log(`    Skipped – ${existingUsers} users already exist.`);
      users = await User.find({});
    } else {
      users = await User.create(usersData);
      console.log(`    ✔ Created ${users.length} users.`);
    }

    const adminUser = users.find((u) => u.role === "admin");
    const customers = users.filter((u) => u.role === "customer");

    // ── 2. Seed Categories ─────────────────────────────────
    console.log("📁  Seeding categories...");
    const existingCategories = await Category.countDocuments();
    let categories;

    if (existingCategories > 0 && !isFresh) {
      console.log(
        `    Skipped – ${existingCategories} categories already exist.`,
      );
      categories = await Category.find({});
    } else {
      const categoryDocs = categoriesData.map((c) => ({
        ...c,
        slug: slugify(c.name),
        image: placeholderImage(c.name),
      }));
      categories = await Category.create(categoryDocs);
      console.log(`    ✔ Created ${categories.length} categories.`);
    }

    // Build a lookup map: "Electronics" → ObjectId
    const categoryMap = {};
    for (const cat of categories) {
      categoryMap[cat.name] = cat._id;
    }

    // ── 3. Seed Products ───────────────────────────────────
    console.log("📦  Seeding products...");
    const existingProducts = await Product.countDocuments();
    let products;

    if (existingProducts > 0 && !isFresh) {
      console.log(
        `    Skipped – ${existingProducts} products already exist.`,
      );
      products = await Product.find({});
    } else {
      const productDocs = buildProducts(categoryMap, adminUser._id);
      products = await Product.create(productDocs);
      console.log(`    ✔ Created ${products.length} products.`);
    }

    // ── 4. Seed Coupons ────────────────────────────────────
    console.log("🎟️   Seeding coupons...");
    const existingCoupons = await Coupon.countDocuments();
    let coupons;

    if (existingCoupons > 0 && !isFresh) {
      console.log(`    Skipped – ${existingCoupons} coupons already exist.`);
      coupons = await Coupon.find({});
    } else {
      coupons = await Coupon.create(buildCoupons(adminUser._id));
      console.log(`    ✔ Created ${coupons.length} coupons.`);
    }

    // ── 5. Seed Reviews ────────────────────────────────────
    console.log("⭐  Seeding reviews...");
    const existingReviews = await Review.countDocuments();

    if (existingReviews > 0 && !isFresh) {
      console.log(`    Skipped – ${existingReviews} reviews already exist.`);
    } else {
      const reviewDocs = [];
      // Each customer reviews 3-4 random products
      for (const customer of customers) {
        const productsToReview = pickRandom(
          products,
          randomInt(3, Math.min(4, products.length)),
        );
        for (const product of productsToReview) {
          // Avoid duplicate user+product reviews
          const alreadyExists = reviewDocs.find(
            (r) =>
              r.user.toString() === customer._id.toString() &&
              r.product.toString() === product._id.toString(),
          );
          if (alreadyExists) continue;

          reviewDocs.push({
            user: customer._id,
            product: product._id,
            rating: randomInt(3, 5),
            comment: pickRandom(reviewComments)[0],
            isApproved: Math.random() > 0.1, // 90% approved
          });
        }
      }

      const reviews = await Review.create(reviewDocs);
      console.log(`    ✔ Created ${reviews.length} reviews.`);

      // Update product rating averages
      for (const product of products) {
        const productReviews = reviews.filter(
          (r) => r.product.toString() === product._id.toString(),
        );
        if (productReviews.length > 0) {
          const avgRating =
            productReviews.reduce((sum, r) => sum + r.rating, 0) /
            productReviews.length;
          await Product.findByIdAndUpdate(product._id, {
            ratingsAverage: Math.round(avgRating * 10) / 10,
            ratingsCount: productReviews.length,
          });
        }
      }
      console.log("    ✔ Updated product rating averages.");
    }

    // ── 6. Seed Wishlists ──────────────────────────────────
    console.log("💖  Seeding wishlists...");
    const existingWishlists = await Wishlist.countDocuments();

    if (existingWishlists > 0 && !isFresh) {
      console.log(
        `    Skipped – ${existingWishlists} wishlists already exist.`,
      );
    } else {
      const wishlistDocs = customers.map((customer) => ({
        user: customer._id,
        products: pickRandom(products, randomInt(2, 5)).map((p) => p._id),
      }));
      const wishlists = await Wishlist.create(wishlistDocs);
      console.log(`    ✔ Created ${wishlists.length} wishlists.`);
    }

    // ── 7. Seed Carts ──────────────────────────────────────
    console.log("🛒  Seeding carts...");
    const existingCarts = await Cart.countDocuments();

    if (existingCarts > 0 && !isFresh) {
      console.log(`    Skipped – ${existingCarts} carts already exist.`);
    } else {
      // Give the first two customers a cart with items
      const cartsToCreate = [];
      for (let i = 0; i < Math.min(2, customers.length); i++) {
        const customer = customers[i];
        const cartProducts = pickRandom(products, randomInt(2, 4));
        const items = cartProducts.map((p) => {
          const qty = randomInt(1, 3);
          const effectivePrice = p.discountPrice || p.price;
          return {
            product: p._id,
            name: p.name,
            image: p.images[0]?.url || "",
            price: effectivePrice,
            quantity: qty,
            stock: p.stock,
            subtotal: effectivePrice * qty,
          };
        });

        const cartTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        cartsToCreate.push({
          user: customer._id,
          items,
          totalItems,
          cartTotal,
          discountPrice: 0,
          payableTotal: cartTotal,
        });
      }

      const carts = await Cart.create(cartsToCreate);
      console.log(`    ✔ Created ${carts.length} carts.`);
    }

    // ── 8. Seed Orders ─────────────────────────────────────
    console.log("📋  Seeding orders...");
    const existingOrders = await Order.countDocuments();

    if (existingOrders > 0 && !isFresh) {
      console.log(`    Skipped – ${existingOrders} orders already exist.`);
    } else {
      const shippingAddresses = [
        {
          fullName: "Rahul Sharma",
          phone: "+91-9876543211",
          addressLine1: "42, MG Road, Koramangala",
          addressLine2: "Near Tata Motors Showroom",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560034",
          country: "India",
        },
        {
          fullName: "Priya Patel",
          phone: "+91-9876543212",
          addressLine1: "15, SV Patel Nagar",
          addressLine2: "Opposite City Mall",
          city: "Ahmedabad",
          state: "Gujarat",
          postalCode: "380015",
          country: "India",
        },
        {
          fullName: "Amit Kumar",
          phone: "+91-9876543213",
          addressLine1: "78, Rajpur Road",
          addressLine2: "",
          city: "Dehradun",
          state: "Uttarakhand",
          postalCode: "248001",
          country: "India",
        },
        {
          fullName: "Sneha Reddy",
          phone: "+91-9876543214",
          addressLine1: "23, Jubilee Hills",
          addressLine2: "Lane 5, Behind KBR Park",
          city: "Hyderabad",
          state: "Telangana",
          postalCode: "500033",
          country: "India",
        },
      ];

      const orderStatuses = ["confirmed", "processing", "shipped", "delivered"];

      const orderDocs = [];
      for (let i = 0; i < Math.min(4, customers.length); i++) {
        const customer = customers[i];
        const orderProducts = pickRandom(products, randomInt(1, 3));
        const orderItems = orderProducts.map((p) => {
          const qty = randomInt(1, 2);
          const effectivePrice = p.discountPrice || p.price;
          return {
            product: p._id,
            name: p.name,
            image: p.images[0]?.url || "",
            price: effectivePrice,
            quantity: qty,
            subtotal: effectivePrice * qty,
          };
        });

        const itemsPrice = orderItems.reduce(
          (sum, item) => sum + item.subtotal,
          0,
        );
        const shippingPrice = itemsPrice > 999 ? 0 : 99;
        const taxPrice = Math.round(itemsPrice * 0.18);
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        const status = orderStatuses[i % orderStatuses.length];

        orderDocs.push({
          user: customer._id,
          orderItems,
          shippingAddress: shippingAddresses[i],
          paymentMethod: i % 2 === 0 ? "cod" : "online",
          paymentStatus: status === "delivered" ? "paid" : "pending",
          orderStatus: status,
          itemsPrice,
          shippingPrice,
          taxPrice,
          discountPrice: 0,
          totalPrice,
          paidAt: status === "delivered" ? new Date() : null,
          deliveredAt: status === "delivered" ? new Date() : null,
        });
      }

      const orders = await Order.create(orderDocs);
      console.log(`    ✔ Created ${orders.length} orders.`);
    }

    // ── Summary ────────────────────────────────────────────
    console.log("\n" + "=".repeat(55));
    console.log("  🌱  SEED COMPLETE!");
    console.log("=".repeat(55));
    console.log(`  Users        : ${await User.countDocuments()}`);
    console.log(`  Categories   : ${await Category.countDocuments()}`);
    console.log(`  Products     : ${await Product.countDocuments()}`);
    console.log(`  Coupons      : ${await Coupon.countDocuments()}`);
    console.log(`  Reviews      : ${await Review.countDocuments()}`);
    console.log(`  Wishlists    : ${await Wishlist.countDocuments()}`);
    console.log(`  Carts        : ${await Cart.countDocuments()}`);
    console.log(`  Orders       : ${await Order.countDocuments()}`);
    console.log("=".repeat(55));
    console.log("\n  📌  Login credentials:");
    console.log("  ─────────────────────────────────────────");
    console.log("  Admin    : admin@marketflow.com  /  Admin@1234");
    console.log("  Customer : rahul@example.com     /  Customer@123");
    console.log("  (All customers share password: Customer@123)\n");
  } catch (error) {
    console.error("❌  Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected from MongoDB.");
  }
}

seed();
