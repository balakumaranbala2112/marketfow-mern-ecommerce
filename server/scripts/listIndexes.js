import { connectDB, disconnectDB } from "../src/config/db.js";
import Product from "../src/models/product.model.js";

async function listIndexes() {
  await connectDB();

  const indexes = await Product.collection.indexes();

  console.log("Product indexes:");

  indexes.forEach((index) => {
    console.log(JSON.stringify(index, null, 2));
  });

  await disconnectDB();
}

listIndexes().catch(async (err) => {
  console.error("Failed to list product indexes:", err.message);
  await disconnectDB();
  process.exit(1);
});
