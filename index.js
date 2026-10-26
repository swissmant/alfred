#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import React, { useState } from "react";
import { render, Box, Text, Static } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import { streamText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { tools } from "./tools/index.js";

try {
	process.loadEnvFile(path.join(import.meta.dirname, ".env"));
} catch {
	// no .env file next to this script — fall back to existing env vars
}

const h = React.createElement;

const model = openai("gpt-4o-mini");

function App() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	async function handleSubmit(value) {
		if (loading) return;
		const text = value.trim();
		setInput("");
		if (!text) return;
		if (text === "/exit" || text === "/quit") {
			process.exit(0);
		}

		const history = [...messages, { role: "user", content: text }];
		setMessages(history);
		setLoading(true);
		setError(null);

		try {
			const result = streamText({
				model,
				messages: history,
				tools,
				stopWhen: stepCountIs(5),
			});

			let full = "";
			for await (const delta of result.textStream) {
				full += delta;
			}

			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: full || "(no response)" },
			]);
		} catch (err) {
			setError(err?.message || String(err));
		} finally {
			setLoading(false);
		}
	}

	return h(
		Box,
		{ flexDirection: "column", paddingX: 1 },
		h(Text, { bold: true, color: "cyan" }, "Alfred"),
		h(Text, { dimColor: true }, "Type a message, or /exit to quit."),
		h(Text, null, " "),
		h(
			Static,
			{ items: messages },
			(message, index) =>
				h(
					Box,
					{ key: index },
					h(
						Text,
						{
							bold: true,
							color: message.role === "user" ? "yellow" : "green",
						},
						message.role === "user" ? "You: " : "Alfred: ",
					),
					h(Text, null, message.content),
				),
		),
		error ? h(Text, { color: "red" }, "Error: " + error) : null,
		h(
			Box,
			null,
			h(
				Text,
				{ color: "cyan" },
				loading ? h(Spinner, { type: "dots" }) : ">",
			),
			h(Text, null, " "),
			h(TextInput, {
				value: input,
				onChange: setInput,
				onSubmit: handleSubmit,
			}),
		),
	);
}

if (!process.env.OPENAI_API_KEY) {
	console.error(
		"Missing OPENAI_API_KEY.\n\nSet it in your environment, e.g.\n  $env:OPENAI_API_KEY = \"sk-...\"   (PowerShell)\n  export OPENAI_API_KEY=sk-...      (bash)\n\nthen run `alfred` again.",
	);
	process.exit(1);
}

render(h(App));
