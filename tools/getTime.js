import { tool } from "ai";
import { z } from "zod";

export const getTime = tool({
	description: "Get the current date and time",
	inputSchema: z.object({}),
	execute: async () => new Date().toString(),
});
