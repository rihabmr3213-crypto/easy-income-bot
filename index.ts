 import TelegramBot from 'node-telegram-bot-api';
 import express from 'express';
 import { storage } from './storage';

 const token = '8450560056:AAHFD0XJh9criJoyF0ULK9ViX2tg1LS0jEE'; 
 const bot = new TelegramBot(token, { polling: true });

 const ADMIN_CHANNEL_ID = '-1003321834512'; 
 const PROOF_CHANNEL = 'https://t.me/easy_income_bd_official'; 
 const MONETAG_LINK = "https://otieu.com/4/10473396"; 

 console.log('Easy Income BD Bot is starting with Direct Ad Link System...');

 bot.on('message', async (msg) => {
   const chatId = msg.chat.id;
   const userId = msg.from?.id;
   const text = msg.text;
   if (!msg || !text || !userId) return;

   if (text.startsWith('/start')) {
     let user = await storage.getUser(userId);
     if (!user) {
       await storage.createUser({
         id: userId,
         points: 0,
         extraPoints: 0,
         username: msg.from?.first_name || 'User'
       });
     }

     const welcomeText = `🚀 **Easy Income BD** 🚀\n\n` +
       `এখানে অ্যাড দেখা এবং রেফারের বিনিময়ে পয়েন্ট ইনকাম করবেন (রেফার বাধ্যতামূলক নয়)।\n\n` +
       `পয়েন্ট গুলো টাকায় কনভার্ট করে উইড্র দিতে পারবেন খুব সহজে। উইড্র দেওয়ার ২৪ ঘন্টার ভিতর পেমেন্ট কনফার্ম করা হয়।\n\n` +
       `👇 **নিচের মেনু দেখে কাজ শুরু করুন:**`;

     bot.sendMessage(chatId, welcomeText, {
       parse_mode: 'Markdown',
       reply_markup: {
         keyboard: [
           [{ text: "👤 প্রোফাইল" }, { text: "🏆 লিডারবোর্ড" }],
           [{ text: "💰 অ্যাড দেখে ইনকাম" }],
           [{ text: "🤝 রেফার করে ইনকাম করুন" }],
           [{ text: "🔄 পয়েন্ট কনভার্ট করে টাকা করুন" }],
           [{ text: "💳 উত্তোলন (Withdraw)" }],
           [{ text: "📢 পেমেন্ট প্রুফ চ্যানেল" }]
         ],
         resize_keyboard: true,
         one_time_keyboard: false
       }
     });
   }

   // অ্যাড ইনকাম বাটন হ্যান্ডলিং - সরাসরি লিঙ্কে ক্লিক করার সিস্টেম
   if (text === "💰 অ্যাড দেখে ইনকাম") {
     bot.sendMessage(chatId, "📺 **অ্যাড দেখে ইনকাম করুন:**\n\nনিচের লিংকে ক্লিক করে ১০ সেকেন্ড অ্যাড দেখুন। ক্লিক করার ১০ সেকেন্ড পর আপনার অ্যাকাউন্টে অটোমেটিক ৫ পয়েন্ট যোগ হবে।", {
       reply_markup: { 
         inline_keyboard: [
           [{ text: "🔗 অ্যাড লিংক (সরাসরি দেখুন)", url: MONETAG_LINK, callback_data: "start_timer" }]
         ] 
       }
     });

     // লিঙ্কে ক্লিক করার পর বাটন চাপার জন্য অপেক্ষা না করে সরাসরি ১০ সেকেন্ডের টাইমার শুরু হবে
     setTimeout(async () => {
       const user = await storage.getUser(userId);
       if (user) {
         const newExtra = (user.extraPoints || 0) + 5;
         await storage.updateUserPoints(userId, user.points, newExtra);
         bot.sendMessage(chatId, `✅ অভিনন্দন! আপনি অ্যাড দেখেছেন। ৫ পয়েন্ট আপনার অ্যাকাউন্টে যোগ করা হয়েছে।`);
       }
     }, 10000); // ১০ সেকেন্ড টাইমার
   }

   // বাকি বাটনগুলো আগের মতোই থাকবে
   else if (text === "👤 প্রোফাইল") {
     const user = await storage.getUser(userId);
     bot.sendMessage(chatId, `👤 **প্রোফাইল**\n💰 ব্যালেন্স: ${user?.points || 0}৳\n🪙 পয়েন্ট: ${user?.extraPoints || 0}`);
   }
   else if (text === "🏆 লিডারবোর্ড") {
     bot.sendMessage(chatId, "🏆 **সেরা ৫ ইউজার:**\n\n১. রিহাব - ৫০০০৳\n২. আরিয়ান - ৪২০০৳\n৩. শান্ত - ৩৮০০৳\n৪. রাকিব - ২৫০০৳\n৫. সাব্বির - ২০০০৳");
   }
   else if (text === "🤝 রেফার করে ইনকাম করুন") {
     bot.sendMessage(chatId, `🤝 **রেফার লিংক:**\nhttps://t.me/Easy_Income_BD_Bot?start=${userId}\n\nবোনাস: প্রতি রেফারে ১০০ পয়েন্ট!`);
   }
   else if (text === "🔄 পয়েন্ট কনভার্ট করে টাকা করুন") {
     const user = await storage.getUser(userId);
     if ((user?.extraPoints || 0) < 15000) {
       bot.sendMessage(chatId, "❌ দুঃখিত, কনভার্ট করতে ১৫,০০০ পয়েন্ট লাগবে।");
     } else {
       const newBalance = (user?.points || 0) + 100;
       const newExtra = (user?.extraPoints || 0) - 15000;
       await storage.updateUserPoints(userId, newBalance, newExtra);
       bot.sendMessage(chatId, "✅ সফল! ১০০ টাকা আপনার মেইন ব্যালেন্সে যোগ হয়েছে।");
     }
   }
   else if (text === "💳 উত্তোলন (Withdraw)") {
     bot.sendMessage(chatId, "💳 মেথড, নাম্বার ও পরিমাণ লিখুন।\nউদা: Bkash 01700000000 600");
   }
   else if (text === "📢 পেমেন্ট প্রুফ চ্যানেল") {
     bot.sendMessage(chatId, `আমাদের পেমেন্ট প্রুফ চ্যানেল: ${PROOF_CHANNEL}`);
   }

   // উইথড্র প্রসেসিং
   if (text && (text.toLowerCase().includes('bkash') || text.toLowerCase().includes('nagad'))) {
     const user = await storage.getUser(userId);
     if ((user?.points || 0) < 600) {
       bot.sendMessage(chatId, `❌ ব্যালেন্স কম। আছে: ${user?.points || 0}৳`);
     } else {
       const newBalance = (user?.points || 0) - 600;
       await storage.updateUserPoints(userId, newBalance, user?.extraPoints || 0);
       bot.sendMessage(ADMIN_CHANNEL_ID, `💰 উইথড্র!\n👤 আইডি: ${userId}\n📱 তথ্য: ${text}`, {
         reply_markup: { inline_keyboard: [[{ text: "✅ Paid", callback_data: `paid_${userId}` }]] }
       });
       bot.sendMessage(chatId, "✅ রিকোয়েস্ট পাঠানো হয়েছে। ২৪ ঘণ্টার মধ্যে পেমেন্ট পাবেন।");
     }
   }
 });

 const app = express();
 app.listen(3001, () => console.log('Bot is Online with Direct Link Point System!'));
