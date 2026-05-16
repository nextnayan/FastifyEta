// server.js

import formbody from "@fastify/formbody"; // 👈 প্লাগিনটি ইম্পোর্ট করো
import Fastify from "fastify";
import authRoutes from "./auth/router.js"; // 👈 নতুন Auth রাউটার ইম্পোর্ট
import configPlugin from "./core/config.js";
import databasePlugin from "./core/database.js"; // ডেটাবেস প্লাগিন ইম্পোর্ট
import securityPlugin from "./core/security.js";
import viewPlugin from "./core/view.js";
import userRoutes from "./user/router.js";

const app = Fastify({
  logger: true,
});

const start = async () => {
  try {
    // প্লাগিনগুলো রেজিস্টার করছি
    await app.register(securityPlugin); // সিকিউরিটি প্লাগিন অ্যাড করা হলো
    await app.register(formbody);
    await app.register(viewPlugin);
    await app.register(configPlugin);
    await app.register(databasePlugin); // ডেটাবেস প্লাগিন রেজিস্টার
    // ডোমেইন রাউটারগুলো লোড করছি
    // prefix: '/api/users' দেওয়ার মানে হলো, এই রাউটারের ভেতরের সব রাউটের
    // আগে স্বয়ংক্রিয়ভাবে /api/users যুক্ত হয়ে যাবে। (যেমন: POST /api/users/)
    await app.register(userRoutes, { prefix: "/api/users" });
    await app.register(authRoutes, { prefix: "/auth" }); // 👈 Auth রাউট রেজিস্টার

    app.get("/", async (request, reply) => {
      return {
        message: "Welcome to FastifyEta Architecture!",
        environment: app.config.env,
        dbStatus: app.db ? "Connected" : "Disconnected", // টেস্টিংয়ের জন্য
      };
    });

    await app.listen({
      port: app.config.port,
      host: app.config.host,
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
