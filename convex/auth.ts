import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      id: "password",
      profile(params) {
        return {
          email: params.email as string,
          name: params.name as string,
        };
      },
    }),
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      const userId = args.userId;
      
      // Create a profile entry when a new user signs up
      if (userId && args.profile) {
        const existingProfile = await (ctx.db as any)
          .query("profiles")
          .withIndex("by_userId", (q: any) => q.eq("userId", userId))
          .first();

        if (!existingProfile) {
          await ctx.db.insert("profiles", {
            userId: userId,
            displayName: args.profile.name as string | undefined,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      }

      // Log the auth event
      const user = await ctx.db.get(userId);
      if (user) {
        await ctx.db.insert("authLogs", {
          action: "user_created_or_updated",
          userId: userId,
          email: user.email,
          success: true,
          timestamp: Date.now(),
        });
      }
    },
  },
});