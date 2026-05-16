// drizzle.config.js
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './user/models.js', // আমাদের মডেল ফাইলের পাথ
  out: './drizzle', // মাইগ্রেশন হিস্ট্রি এখানে জমা হবে
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:db.sqlite3',
  },
});