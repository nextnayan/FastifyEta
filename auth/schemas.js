// auth/schemas.js
import { Type } from '@sinclair/typebox';

// রেজিস্ট্রেশন ফর্মের জন্য স্কিমা (Name, Email, Password)
export const registerBodySchema = Type.Object({
  name: Type.String({ minLength: 3 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }) // পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে
});

// লগিন ফর্মের জন্য স্কিমা (শুধু Email এবং Password)
export const loginBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String()
});