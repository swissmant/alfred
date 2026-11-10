import assert from "node:assert/strict";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { tools } from "../tools/index.js";

export async function run() {

	const result = await generateText({
		model: openai("gpt-4o-mini"),
		tools,
		prompt: "What time is it right now?",
	});

	const call = result.toolCalls.find((c) => c.toolName === "getTime");
	assert.ok(call, "expected the model to call the getTime tool");

	return "model correctly called the getTime tool";
}
