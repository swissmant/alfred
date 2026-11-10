import { readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

try {
	process.loadEnvFile(path.join(import.meta.dirname, "..", ".env"));
} catch {
	// no .env file — fall back to existing env vars
}

const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const cyan = (text) => `\x1b[36m${text}\x1b[0m`;

const evalsDir = import.meta.dirname;
const files = readdirSync(evalsDir, { recursive: true })
	.filter((file) => file.endsWith(".eval.js"))
	.sort();

let passed = 0;
let failed = 0;
let skipped = 0;

if (!process.env.OPENAI_API_KEY) {
	console.warn("Could not run evals: OPENAI_API_KEY needs to be set" );
	process.exit(1);
}

for (const file of files) {
	const { run } = await import(pathToFileURL(path.join(evalsDir, file)).href);

	try {
		const result = await run();
		if (result && result.skipped) {
			skipped += 1;
			console.log(`${cyan("SKIP")}  ${file} — ${result.reason}`);
		} else {
			passed += 1;
			console.log(`${green("PASS")}  ${file} — ${result}`);
		}
	} catch (err) {
		failed += 1;
		console.log(`${red("FAIL")}  ${file} — ${err.message}`);
	}
}

console.log(
	`\n${green(`${passed} passed`)}, ${red(`${failed} failed`)}, ${cyan(`${skipped} skipped`)}`,
);
process.exit(failed > 0 ? 1 : 0);
