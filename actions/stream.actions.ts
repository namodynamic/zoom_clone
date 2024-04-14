"use server";

import { currentUser } from "@clerk/nextjs/server";

import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User is not logged in");
  if (!apiKey) throw new Error("Missing Stream API key");
  if (!apiSecret) throw new Error("Missing Stream API secret");

  const client = new StreamClient(apiKey, apiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60; // 1 hour expiration
  const issued = Math.floor(Date.now() / 1000) - 60; // 1 minute in the past (when the token was issued)

  const token = client.createToken(user.id, exp, issued); // create a new token

  return token;
};
