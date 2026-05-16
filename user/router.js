// user/router.js
import { requireAdmin } from "./middleware.js"; // 👈 Middleware ইম্পোর্ট
import { createUserSchema } from "./schemas.js";
import { createUserService, getAllUsersService } from "./service.js";
import { getInitials } from "./utils.js"; // 👈 Utils ইম্পোর্ট

export default async function userRoutes(fastify, options) {
  // POST /api/users (আগের মতোই থাকবে)
  fastify.post(
    "/",
    { schema: createUserSchema.schema },
    async (request, reply) => {
      const userData = request.body;
      const newUser = await createUserService(fastify.db, userData);
      return reply.code(201).send({ message: "User created", user: newUser });
    },
  );

  // GET /api/users/dashboard
  fastify.get(
    "/dashboard",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const dbUsers = await getAllUsersService(fastify.db);

      // Utils ব্যবহার করে প্রতিটি ইউজারের জন্য Initials তৈরি করে দিচ্ছি
      const usersWithInitials = dbUsers.map((user) => ({
        ...user,
        initials: getInitials(user.name), // NS, JD ইত্যাদি
      }));

      return reply.view("user/dashboard.eta", {
        title: "User Dashboard",
        users: usersWithInitials, // আপডেট করা লিস্ট পাঠাচ্ছি
        currentUser: request.user,
      });
    },
  );

  // ----------------------------------------------------
  // নতুন ADMIN-ONLY API রাউট (Middleware টেস্টিংয়ের জন্য)
  // ----------------------------------------------------
  fastify.delete(
    "/:id",
    {
      // লক্ষ্য করো: এখানে দুটি Hook (Middleware) চেইন করা হয়েছে!
      // আগে লগিন চেক করবে, তারপর অ্যাডমিন পারমিশন চেক করবে।
      preHandler: [fastify.authenticate, requireAdmin],
    },
    async (request, reply) => {
      // যদি কোড এই লাইন পর্যন্ত আসে, তার মানে ইউজার লগিন করা এবং সে একজন অ্যাডমিন!
      const userId = request.params.id;
      return reply.send({
        message: `User ${userId} deleted successfully by Admin.`,
      });
    },
  );
}
