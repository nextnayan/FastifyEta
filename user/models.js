// user/models.js

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Drizzle ORM Model: users table
 * এটি ডেটাবেসে আমাদের টেবিলের ডিজাইন।
 */
export const users = sqliteTable('users', {
  // Primary Key
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // Name (String)
  name: text('name').notNull(),
  
  // Email (String, Unique)
  email: text('email').notNull().unique(),

  // Password (String)
  password: text('password').notNull(),
  
  // Created Timestamp
  // SQL এর CURRENT_TIMESTAMP ব্যবহার করে ডিফল্ট সময় সেট করা হচ্ছে
  createdAt: text('created_at').default('CURRENT_TIMESTAMP')
});