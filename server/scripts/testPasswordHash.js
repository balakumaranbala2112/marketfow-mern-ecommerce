import { connectDB, disconnectDB } from "../src/config/db.js";
import User from "../src/models/user.model.js";

async function testPasswordHashing() {
  await connectDB();

  const testEmail = `password-test-${Date.now()}@example.com`;
  const plainPassword = "Password123";

  const user = await User.create({
    name: "Password Test User",
    email: testEmail,
    password: plainPassword,
  });

  const savedUser = await User.findOne({ email: testEmail }).select(
    "+password",
  );

  const isPasswordHashed = savedUser.password !== plainPassword;
  const isCorrectPassword = await savedUser.comparePassword(plainPassword);
  const isWrongPassword = await savedUser.comparePassword("WrongPassword123");

  console.log("Password hashing test result:");
  console.log(`- Password is hashed: ${isPasswordHashed}`);
  console.log(`- Correct password matches: ${isCorrectPassword}`);
  console.log(`- Wrong password matches: ${isWrongPassword}`);

  await User.deleteOne({ email: testEmail });

  await disconnectDB();
}

testPasswordHashing().catch(async (err) => {
  console.error("Password hashing test failed:", err.message);
  await disconnectDB();
  process.exit(1);
});
