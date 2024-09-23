import { logDevReady } from "@remix-run/cloudflare";
import * as build from "@remix-run/dev/server-build";
import { Hono } from "hono";
// You can also use it with other runtimes
import { handle } from "hono/cloudflare-pages";
import { remix } from "remix-hono/handler";

if (process.env.NODE_ENV === "development") logDevReady(build);

/* type your Cloudflare bindings here */
type Bindings = {};

/* type your Hono variables (used with c.get/c.set) here */
type Variables = {};

type ContextEnv = { Bindings: Bindings; Variables: Variables };

const server = new Hono<ContextEnv>();

// Add the Remix middleware to your Hono server
server.use(
	"*",
	remix({
		build,
		mode: process.env.NODE_ENV as "development" | "production",
		// getLoadContext is optional, the default function is the same as here
		getLoadContext(c) {
			return c.env;
		},
	}),
);

// Create a Cloudflare Pages request handler for your Hono server
export const onRequest = handle(server);