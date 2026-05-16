// core/errorHandler.js

import fp from 'fastify-plugin';

const errorHandlerPlugin = async (fastify, options) => {
  
  // ==========================================
  // ১. গ্লোবাল 404 Not Found হ্যান্ডলার
  // ==========================================
  fastify.setNotFoundHandler(function (request, reply) {
    // Content Negotiation: ক্লায়েন্ট কী ধরনের ডেটা এক্সেপ্ট করে তা চেক করা
    const acceptHeader = request.headers.accept || '';

    if (acceptHeader.includes('text/html')) {
      // ব্রাউজার হলে HTML Error Page দেখাবে
      return reply.code(404).view('error.eta', {
        title: 'Page Not Found',
        statusCode: 404,
        message: "The page you are looking for doesn't exist or has been moved."
      });
    } else {
      // API রিকোয়েস্ট হলে JSON পাঠাবে
      return reply.code(404).send({ 
        success: false,
        error: 'Not Found', 
        message: `Route ${request.method}:${request.url} not found` 
      });
    }
  });

  // ==========================================
  // ২. গ্লোবাল Exception/Error হ্যান্ডলার (500, 400, 401 ইত্যাদি)
  // ==========================================
  fastify.setErrorHandler(function (error, request, reply) {
    // ডেভলপমেন্টের সুবিধার জন্য কনসোলে আসল এররটি লগ করা
    fastify.log.error(error);

    // Fastify/TypeBox এর ভ্যালিডেশন এরর, কাস্টম এরর নাকি সার্ভার ক্র্যাশ—তার ভিত্তিতে স্ট্যাটাস কোড
    const statusCode = error.statusCode || 500;
    // সিকিউরিটির জন্য প্রোডাকশনে 500 এররের আসল ডিটেইলস ইউজারকে না দেখানো ভালো
    const message = statusCode === 500 && process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : error.message;

    const acceptHeader = request.headers.accept || '';

    if (acceptHeader.includes('text/html')) {
        // ব্রাউজারে সুন্দর এরর পেইজ
        return reply.code(statusCode).view('error.eta', {
            title: `Error ${statusCode}`,
            statusCode: statusCode,
            message: message
        });
    } else {
        // API রেসপন্স
        return reply.code(statusCode).send({
            success: false,
            error: error.name || 'Error',
            message: message,
            statusCode: statusCode
        });
    }
  });

  fastify.log.info('Global Error & Not Found Handlers initialized.');
};

export default fp(errorHandlerPlugin, {
  name: 'app-error-handler'
});