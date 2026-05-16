// user/utils.js

/**
 * ইউজারের পুরো নাম থেকে প্রথম দুটি অক্ষর (Initials) বের করার ফাংশন।
 * উদাহরণ: "Nayan Sarker" -> "NS"
 */
export const getInitials = (name) => {
  if (!name) return 'U'; // User এর ডিফল্ট
  
  const parts = name.split(' ');
  let initials = parts[0][0]; // প্রথম নামের প্রথম অক্ষর
  
  if (parts.length > 1) {
    initials += parts[parts.length - 1][0]; // শেষের নামের প্রথম অক্ষর
  }
  
  return initials.toUpperCase();
};