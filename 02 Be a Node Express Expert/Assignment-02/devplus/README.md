# Express Server Documentation

এই ডকুমেন্টে Express সার্ভার কীভাবে স্টার্ট করবেন এবং প্রোজেক্টের ফোল্ডার স্ট্রাকচার কীভাবে কাজ করে তা সংক্ষেপে বলা হয়েছে।

## Server Start Flow (Runtime Chain)
1) `src/server.ts` এন্ট্রি পয়েন্ট।
2) `src/app.ts` থেকে Express app ইমপোর্ট হয়।
3) `src/Config/index.ts` থেকে config (PORT ইত্যাদি) লোড হয়।
4) `src/db/index.ts` থেকে `initDB()` কল হয়ে DB কানেক্ট হয়।
5) `app.listen(config.port)` দিয়ে সার্ভার চালু হয়।

## How to Start Server

### 1) Install dependencies
```bash
npm install
```

### 2) Add environment variables
`.env` ফাইলে প্রয়োজনীয় ভ্যারিয়েবল দিন (উদাহরণ):
```
PORT=3000
DB_URL=your_database_url
```

### 3) Run the server
আপনার `package.json`-এ থাকা script অনুযায়ী চালান (যেমন `dev` বা `start`)। সাধারণভাবে:
```bash
npm run dev
```

## Folder Structure (src)

- `app.ts`: Express app কনফিগ (middleware, routes, error handler)।
- `server.ts`: app বুটস্ট্র্যাপ (DB connect, app.listen)।
- `Config/`: environment validation + config export।
- `db/`: database connection setup।
- `modules/`: ফিচার/ডোমেইন ভিত্তিক কোড (route/controller/service ইত্যাদি)।
- `middleware/`: shared middleware (auth, errorHandler, notFound)।
- `types/`: shared TypeScript types/interfaces।
- `utils/`: helper utilities (asyncHandler, logger, response formatter)।

## Suggested Next Steps
1) `modules/`-এ একটি ফিচার (যেমন `user`) দিয়ে route/controller/service skeleton তৈরি করুন।
2) `middleware/`-এ `errorHandler` ও `notFound` যুক্ত করুন।
3) `Config/`-এ env validation যুক্ত করুন (zod/joi)।
