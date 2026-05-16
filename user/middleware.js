// user/middleware.js

/**
 * Custom Fastify preHandler Hook (Middleware)
 * এটি চেক করবে ইউজার অ্যাডমিন কি না। 
 * নোট: এটি রান হওয়ার আগে অবশ্যই core/security.js এর `authenticate` হুকটি রান হতে হবে, 
 * নাহলে আমরা `request.user` পাব না!
 */
export const requireAdmin = async (request, reply) => {
  
  // ১. ইউজার অবজেক্ট আছে কি না চেক করা
  if (!request.user) {
    return reply.code(401).send({ error: 'Unauthorized: Please log in first.' });
  }

  // ২. অ্যাডমিন লজিক চেক (বাস্তব প্রোজেক্টে এটি ডেটাবেসের 'role' কলাম থেকে আসবে)
  const adminEmails = ['nayan@example.com']; 
  
  if (!adminEmails.includes(request.user.email)) {
    // 403 Forbidden: ইউজার লগিন করা আছে, কিন্তু এই পেজে যাওয়ার পারমিশন নেই
    return reply.code(403).send({ 
      error: 'Forbidden: You do not have admin privileges.' 
    });
  }
  
  // Fastify-তে রিটার্ন না করলে বা এরর থ্রো না করলে এটি স্বয়ংক্রিয়ভাবে 
  // পরবর্তী ধাপে (রাউটারে) চলে যায়। `next()` ডাকার প্রয়োজন নেই! (Fastify Magic ✨)
};