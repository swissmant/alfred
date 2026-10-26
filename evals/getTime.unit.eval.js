import assert from "node:assert/strict";
import { getTime } from "../tools/getTime.js";

export async function run() {
	const result = await getTime.execute(
		{},
		{ toolCallId: "unit-test", messages: [] },
	);

	assert.equal(typeof result, "string");
	assert.match(result, /\d{4}/, "expected result to contain a 4-digit year");

	return "returned a date string containing a year";
}
