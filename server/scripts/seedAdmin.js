import { connectDB, disconnectDB } from "../src/config/db.js";
import Roles from "../src/constants/roles.js";
import User from "../src/models/user.model.js";

async function seedAdmin() {
  await connectDB();

  const adminEmail = "admin@marketflow.com";
  const adminPassword = "Admin12345";

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log("Admin user already exists:");
    console.log(`- Email: ${adminEmail}`);
    await disconnectDB();
    return;
  }

  await User.create({
    name: "MarketFlow Admin",
    email: adminEmail,
    password: adminPassword,
    role: Roles.ADMIN,
    emailVerified: true,
  });

  console.log("Admin user created successfully:");
  console.log(`- Email: ${adminEmail}`);
  console.log(`- Password: ${adminPassword}`);

  await disconnectDB();
}

seedAdmin().catch(async (err) => {
  console.error("Failed to seed admin user:", err.message);
  await disconnectDB();
  process.exit(1);
});
