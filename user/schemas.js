// user/schemas.js

import { Type } from "@sinclair/typebox";

/**
 * ১. ইনকামিং রিকোয়েস্ট বডি (Body) ভ্যালিডেশন
 * ইউজার তৈরি করার সময় ক্লায়েন্ট কী কী ডেটা পাঠাবে এবং তার টাইপ কী হবে।
 */
export const createUserBodySchema = Type.Object({
  name: Type.String({ minLength: 3 }),
  email: Type.String({ format: "email" }),
});

/**
 * ২. আউটগোয়িং রেসপন্স (Response) সিরিয়ালাইজেশন
 * ইউজার তৈরি হওয়ার পর আমরা ক্লায়েন্টকে কী রেসপন্স দেব।
 */
export const createUserResponseSchema = Type.Object({
  message: Type.String(),
  user: Type.Object({
    id: Type.Number(),
    name: Type.String(),
    email: Type.String(),
    // লক্ষ্য করো: আমরা এখানে createdAt ফিল্ড রাখিনি।
    // Fastify স্বয়ংক্রিয়ভাবে রেসপন্স থেকে createdAt ফিল্টার করে বাদ দিয়ে দেবে! (সিকিউরিটি)
  }),
});
// export const createUserResponseSchema = Type.Object({
//   message: Type.String(),

//   // Type.Intersect ব্যবহার করে আমরা দুটি অবজেক্টকে একত্রিত (Merge) করছি
//   user: Type.Intersect([
//     Type.Object({ id: Type.Number() }), // নতুন প্রপার্টি id
//     createUserBodySchema                // আগে থেকে তৈরি করা বডি স্কিমা
//   ])
// });
/**
 * ৩. Fastify Route Schema অবজেক্ট
 * এটি আমরা সরাসরি রাউটে ব্যবহার করব।
 */
export const createUserSchema = {
  // ট্যাগ এবং ডেসক্রিপশন Swagger/OpenAPI ডকুমেন্টেশনের জন্য কাজে লাগবে ভবিষ্যতে
  schema: {
    tags: ["User"],
    description: "Create a new user",
    body: createUserBodySchema,
    response: {
      201: createUserResponseSchema, // 201 Created স্ট্যাটাস কোডের জন্য এই স্কিমা
    },
  },
};
