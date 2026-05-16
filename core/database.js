// core/database.js

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import fp from "fastify-plugin";

const databasePlugin = async (fastify, options) => {
  try {
    // ১. LibSQL ক্লায়েন্ট তৈরি করা (পোর্টেবল)
    const sqlite = createClient({ url: "file:db.sqlite3" });

    // ২. Database Optimizations (PRAGMA Queries)
    // ক্লায়েন্ট ইনিশিয়ালাইজ হওয়ার সাথে সাথেই আমরা ডেটাবেসের ইঞ্জিনকে টিউন করছি

    // WAL Mode চালু করা (Concurrency এর জন্য)
    await sqlite.execute("PRAGMA journal_mode = WAL;");

    // Waiting Time 5000ms (5 সেকেন্ড) সেট করা (Locking এরর কমানোর জন্য)
    await sqlite.execute("PRAGMA busy_timeout = 5000;");

    // WAL Mode এর সাথে synchronous=NORMAL ব্যবহার করলে পারফরম্যান্স সবচেয়ে ভালো পাওয়া যায়
    await sqlite.execute("PRAGMA synchronous = NORMAL;");

    // ৩. Drizzle ORM এর সাথে কানেক্ট করা
    const db = drizzle(sqlite);

    // ৪. Fastify Decorator এর মাধ্যমে গ্লোবাল করা
    fastify.decorate("db", db);

    fastify.log.info(
      "Database connected with LibSQL. (WAL Mode & Busy Timeout Active)",
    );
  } catch (error) {
    fastify.log.error("Database connection failed:", error);
    throw error;
  }
};

export default fp(databasePlugin, {
  name: "app-database",
  dependencies: ["app-config"],
});
