// core/security.js

import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

const securityPlugin = async (fastify, options) => {
  
  // ১. JWT এবং Cookie প্লাগিন রেজিস্টার করা
  fastify.register(fastifyJwt, { 
    // প্রোডাকশনে এটি .env থেকে আসবে
    secret: process.env.JWT_SECRET || 'super_secret_fastify_eta_key' 
  });
  
  fastify.register(fastifyCookie);

  // ২. Fastify Decorator ম্যাজিক: Custom Auth Hook তৈরি
  // আমরা fastify অবজেক্টে 'authenticate' নামে একটি ফাংশন যুক্ত করছি, 
  // যা পুরো প্রজেক্টের যেকোনো রাউটে ব্যবহার করা যাবে।
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      // রিকোয়েস্টের কুকি থেকে টোকেন নেওয়া
      const token = request.cookies.token;
      
      if (!token) {
        throw new Error('Authentication required');
      }

      // টোকেন ভ্যালিডেট করা এবং ইউজারের ডেটা বের করা
      const decodedUser = fastify.jwt.verify(token);
      
      // ডিকোড করা ইউজারের ডেটা request অবজেক্টে সেভ করে রাখলাম
      // যাতে রাউটার বা কন্ট্রোলার এটি অ্যাক্সেস করতে পারে!
      request.user = decodedUser; 
      
    } catch (err) {
      // টোকেন না থাকলে বা এক্সপায়ার হয়ে গেলে লগিন পেইজে রিডাইরেক্ট করবে
      return reply.redirect('/auth/login');
    }
  });

  fastify.log.info('Security plugin (JWT & Cookies) initialized.');
};

export default fp(securityPlugin, {
  name: 'app-security'
});