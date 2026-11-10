import assert from "node:assert/strict";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { tools } from "../../tools/index.js";

export async function run() {

    const result = await generateText({
        model: openai("gpt-4o-mini"),
        tools,
        prompt: "Get the latest 5 emails from Fastmail",
    });

    const call = result.toolCalls.find((c) => c.toolName === "getEmail");
    assert.ok(call, "expected the model to call the getEmail tool");

    return "model correctly called the getEmail tool";
}
