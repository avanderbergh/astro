import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	env: {
		schema: {
			FOO: envField.string({ context: "client", access: "public" }),
			BAR: envField.number({ context: "server", access: "public" }),
		}
	}
});
