// DEFAULT CODE I MET WITH DRIZZLE KIT, BEFORE LUMYN INJECTION
// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   schema: "./src/db/schema/*.ts",
//   out: "./src/db/migrations",
//   dialect: "sqlite",
//   driver: "d1-http",
// });



// LUMYN INJECTION
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // 1. Tell Drizzle where your schema tables are saved
  schema: "./src/db/schema/*.ts", 
  
  // 2. Tell Drizzle where to generate migration files
  out: "./src/db/migrations",
  
  // 3. Keep the dialect on sqlite for Cloudflare D1 compatibility
  dialect: "sqlite",

  // 4. Connect Drizzle Studio to your local testing environment data
    dbCredentials: {
    url: "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/d7e7dad26bda2eb41e10f2b5b0776873c53023ab37e537e0aca2622a0a57c851.sqlite",
  },

});
