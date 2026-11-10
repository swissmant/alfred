import { tool } from "ai";
import { z } from "zod";

export const getEmail = tool({
	description: "Retrieve emails from the email service (Fastmail)",
	inputSchema: z.object({}),
	execute: async () => `Here are some emails`,
});
