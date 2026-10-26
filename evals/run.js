import { readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

try {
	process.loadEnvFile(path.join(import.meta.dirname, "..", ".env"));
} catch {
	// no .env file — fall back to existing env vars
}

const evalsDir = import.meta.dirname;
const files = readdirSync(evalsDir)
	.filter((file) => file.endsWith(".eval.js"))
	.sort();

let passed = 0;
let failed = 0;
let skipped = 0;

for (const file of files) {
	const { run } = await import(pathToFileURL(path.join(evalsDir, file)).href);

	try {
		const result = await run();
		if (result && result.skipped) {
			skipped += 1;
			console.log(`SKIP  ${file} — ${result.reason}`);
		} else {
			passed += 1;
			console.log(`PASS  ${file} — ${result}`);
		}
	} catch (err) {
		failed += 1;
		console.log(`FAIL  ${file} — ${err.message}`);
	}
}

console.log(`\n${passed} passed, ${failed} failed, ${skipped} skipped`);
process.exit(failed > 0 ? 1 : 0);
