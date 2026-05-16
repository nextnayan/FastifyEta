// core/view.js

import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import fp from "fastify-plugin";
// ১. Eta এর মূল ক্লাসটি (Class) ইমপোর্ট করছি
import { Eta } from "eta";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viewPlugin = async (fastify, options) => {
  // স্ট্যাটিক ফাইল সার্ভার (CSS সার্ভ করার জন্য)
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "../public"),
    prefix: "/public/",
  });

  // ২. Eta v3 এর একটি নতুন ইন্সট্যান্স তৈরি করা
  const etaEngine = new Eta({
    views: path.join(__dirname, "../views"), // টেমপ্লেট ডিরেক্টরি চিনিয়ে দেওয়া
    cache: fastify.config?.env === "production", // প্রোডাকশনে টেমপ্লেট ক্যাশ করবে স্পিডের জন্য
  });

  // ৩. Fastify View এর সাথে আমাদের নতুন Eta ইঞ্জিন যুক্ত করা
  fastify.register(fastifyView, {
    engine: {
      eta: etaEngine,
    },
    templates: path.join(__dirname, "../views"),
  });

  fastify.log.info(
    "View Engine (Eta v3) and Static Server initialized successfully.",
  );
};

export default fp(viewPlugin, {
  name: "app-view",
});
