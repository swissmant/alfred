import { getTime } from "./getTime.js";

import { getEmail } from "./email/getEmail.js";

export const utilityTools = {
	getTime
};

export const emailTools = {
	getEmail
};

export const tools = { ...utilityTools, ...emailTools };