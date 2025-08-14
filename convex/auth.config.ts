export default {
  providers: [
    {
      domain: process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210",
      applicationID: "convex",
    },
  ],
};