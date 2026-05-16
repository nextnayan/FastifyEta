// auth/service.js
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "../user/models.js";

export const registerUserService = async (db, userData) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, userData.email));

  if (existingUser.length > 0) {
    throw new Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // হ্যাশ করা পাসওয়ার্ড সহ ডেটাবেসে ইনসার্ট
  const result = await db
    .insert(users)
    .values({
      name: userData.name,
      email: userData.email,
      password: hashedPassword, // 👈 যুক্ত করা হলো
    })
    .returning();

  return result[0];
};

export const loginUserService = async (db, email, password) => {
  // ১. ইমেইল দিয়ে ইউজার খোঁজা
  const result = await db.select().from(users).where(eq(users.email, email));
  const user = result[0];

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // ২. পাসওয়ার্ড চেক করা (Plain Text vs Hash)
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
};
