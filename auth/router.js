// auth/router.js

import { loginBodySchema, registerBodySchema } from "./schemas.js";
import { loginUserService, registerUserService } from "./service.js";

export default async function authRoutes(fastify, options) {
  // ==========================================
  // ১. VIEW ROUTES (HTML ফর্ম দেখানোর জন্য) -> Method: GET
  // ==========================================

  fastify.get("/register", async (request, reply) => {
    return reply.view("auth/register.eta", { title: "Register" });
  });

  fastify.get("/login", async (request, reply) => {
    return reply.view("auth/login.eta", { title: "Login" });
  });

  // ==========================================
  // ২. API ROUTES (ফর্ম সাবমিট হ্যান্ডেল করার জন্য) -> Method: POST
  // ==========================================

  // এই রাউটটিই তোমার মিসিং ছিল বা ঠিকমতো কনফিগার করা হয়নি!
  fastify.post(
    "/register",
    {
      schema: { body: registerBodySchema }, // TypeBox স্কিমা দিয়ে ইনপুট ভ্যালিডেশন
    },
    async (request, reply) => {
      try {
        // সার্ভিসকে কল করে ডেটাবেসে ইউজার সেভ করা হচ্ছে
        await registerUserService(fastify.db, request.body);

        // সফল হলে লগিন পেইজে রিডাইরেক্ট (পাঠিয়ে) দেওয়া হবে
        return reply.redirect("/auth/login");
      } catch (error) {
        // ইমেইল আগে থেকেই থাকলে বা অন্য এরর হলে
        return reply.code(400).send({ error: error.message });
      }
    },
  );

  // লগিন ফর্ম সাবমিট করার জন্য রাউট
  fastify.post(
    "/login",
    {
      schema: { body: loginBodySchema },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        const user = await loginUserService(fastify.db, email, password);

        // JWT টোকেন তৈরি করা
        const token = fastify.jwt.sign({
          id: user.id,
          name: user.name,
          email: user.email,
        });

        // কুকিতে টোকেন সেট করা
        reply.setCookie("token", token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24,
        });

        // লগিন সফল হলে ড্যাশবোর্ডে পাঠিয়ে দেওয়া হবে
        return reply.redirect("/api/users/dashboard");
      } catch (error) {
        return reply.code(401).send({ error: error.message });
      }
    },
  );

  // লগআউট রাউট
  fastify.get("/logout", async (request, reply) => {
    reply.clearCookie("token", { path: "/" });
    return reply.redirect("/auth/login");
  });
}
