// core/config.js

import fp from 'fastify-plugin';
import dotenv from 'dotenv';

// .env ফাইল থেকে ভেরিয়েবলগুলো process.env তে লোড করবে
dotenv.config();

/**
 * এটি আমাদের কনফিগারেশন প্লাগিন।
 * আমরা fastify-plugin (fp) ব্যবহার করছি যাতে এই কনফিগারেশনগুলো
 * পুরো অ্যাপ্লিকেশন জুড়ে (গ্লোবালি) অ্যাক্সেস করা যায়।
 */
const configPlugin = async (fastify, options) => {
  
  // একটি কনফিগ অবজেক্ট তৈরি করছি
  const config = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '127.0.0.1',
    env: process.env.NODE_ENV || 'development',
  };

  // Fastify Decorator এর মাধ্যমে কনফিগ অবজেক্টটি Fastify ইন্সট্যান্সে যুক্ত করা হলো
  fastify.decorate('config', config);
  
  fastify.log.info('Config plugin loaded successfully.');
};

// fp দিয়ে র‍্যাপ (wrap) করে এক্সপোর্ট করছি
export default fp(configPlugin, {
  name: 'app-config' // ডিবাগিং এর সুবিধার্থে প্লাগিনের একটি নাম দেওয়া ভালো
});