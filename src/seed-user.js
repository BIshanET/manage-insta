const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const UserSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: { type: String },
    });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const name = "bishan";
    const email = "bishan@example.com";
    const password = "HelloEliot@5284";

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { email },
      { name, email, password: hashedPassword },
      { upsert: true, new: true }
    );

    console.log(`User ${name} created/updated successfully!`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seed();
