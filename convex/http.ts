import { httpRouter } from "convex/server";
import { register, login } from "./http_auth";

const http = httpRouter();

// Add auth routes
http.route({
  path: "/auth/register",
  method: "POST",
  handler: register,
});

http.route({
  path: "/auth/login", 
  method: "POST",
  handler: login,
});

export default http;