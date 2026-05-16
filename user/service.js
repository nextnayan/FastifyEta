// user/service.js

import { users } from "./models.js";

/**
 * Service: Create User
 * এই ফাংশনটি ডেটাবেসে নতুন ইউজার তৈরি করবে।
 * লক্ষ্য করো, আমরা এখানে `request` বা `reply` ব্যবহার করছি না।
 * আমরা শুধু ডেটাবেস ইন্সট্যান্স (db) এবং ইউজার ডেটা (userData) নিচ্ছি।
 */
export const getAllUsersService = async (db) => {
  // Drizzle ORM দিয়ে 'users' টেবিলের সব ডেটা সিলেক্ট করা
  // সিকিউরিটির জন্য আমরা পাসওয়ার্ড ফিল্ডটি বাদ দিয়ে শুধু id, name, email আনছি
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users);

  return allUsers;
};

export const createUserService = async (db, userData) => {
  // Drizzle ORM এর insert সিনট্যাক্স
  const result = await db
    .insert(users)
    .values({
      name: userData.name,
      email: userData.email,
    })
    .returning(); // .returning() দিলে ইনসার্ট হওয়া ডেটাটি সাথে সাথে রিটার্ন করে

  // Drizzle একটি অ্যারে রিটার্ন করে, তাই আমরা প্রথম আইটেমটি নিচ্ছি
  return result[0];
};
