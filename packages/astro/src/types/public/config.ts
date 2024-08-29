import type { OutgoingHttpHeaders } from 'node:http';
import type {
	RehypePlugins,
	RemarkPlugins,
	RemarkRehype,
	ShikiConfig,
} from '@astrojs/markdown-remark';
import type { UserConfig as OriginalViteUserConfig, SSROptions as ViteSSROptions } from 'vite';
import type { RemotePattern } from '../../assets/utils/remotePattern.js';
import type { AssetsPrefix } from '../../core/app/types.js';
import type { AstroConfigType } from '../../core/config/schema.js';
import type { REDIRECT_STATUS_CODES } from '../../core/constants.js';
import type { Logger, LoggerLevel } from '../../core/logger/core.js';
import type { EnvSchema } from '../../env/schema.js';
import type { AstroIntegration } from './integrations.js';

export type Locales = (string | { codes: string[]; path: string })[];

export interface ImageServiceConfig<T extends Record<string, any> = Record<string, any>> {
	entrypoint: 'astro/assets/services/sharp' | (string & {});
	config?: T;
}

export type RuntimeMode = 'development' | 'production';

export type ValidRedirectStatus = (typeof REDIRECT_STATUS_CODES)[number];

export type RedirectConfig =
	| string
	| {
			status: ValidRedirectStatus;
			destination: string;
	  };

export type ServerConfig = {
	/**
	 * @name server.host
	 * @type {string | boolean}
	 * @default `false`
	 * @version 0.24.0
	 * @description
	 * Set which network IP addresses the dev server should listen on (i.e. 	non-localhost IPs).
	 * - `false` - do not expose on a network IP address
	 * - `true` - listen on all addresses, including LAN and public addresses
	 * - `[custom-address]` - expose on a network IP address at `[custom-address]`
	 */
	host?: string | boolean;

	/**
	 * @name server.port
	 * @type {number}
	 * @default `4321`
	 * @description
	 * Set which port the dev server should listen on.
	 *
	 * If the given port is already in use, Astro will automatically try the next available port.
	 */
	port?: number;

	/**
	 * @name server.headers
	 * @typeraw {OutgoingHttpHeaders}
	 * @default `{}`
	 * @version 1.7.0
	 * @description
	 * Set custom HTTP response headers to be sent in `astro dev` and `astro preview`.
	 */
	headers?: OutgoingHttpHeaders;

	/**
	 * @name server.open
	 * @type {string | boolean}
	 * @default `false`
	 * @version 4.1.0
	 * @description
	 * Controls whether the dev server should open in your browser window on startup.
	 *
	 * Pass a full URL string (e.g. "http://example.com") or a pathname (e.g. "/about") to specify the URL to open.
	 *
	 * ```js
	 * {
	 *   server: { open: "/about" }
	 * }
	 * ```
	 */
	open?: string | boolean;
};

export interface ViteUserConfig extends OriginalViteUserConfig {
	ssr?: ViteSSROptions;
}

// NOTE(fks): We choose to keep our hand-generated AstroUserConfig interface so that
// we can add JSDoc-style documentation and link to the definition file in our repo.
// However, Zod comes with the ability to auto-generate AstroConfig from the schema
// above. If we ever get to the point where we no longer need the dedicated type,
// consider replacing it with the following lines:
// export interface AstroUserConfig extends z.input<typeof AstroConfigSchema> {
// }

/**
 * Astro User Config
 * Docs: https://docs.astro.build/reference/configuration-reference/
 */
export interface AstroUserConfig {
	/**
	 * @docs
	 * @kind heading
	 * @name Top-Level Options
	 */

	/**
	 * @docs
	 * @name site
	 * @type {string}
	 * @description
	 * Your final, deployed URL. Astro uses this full URL to generate your sitemap and canonical URLs in your final build. It is strongly recommended that you set this configuration to get the most out of Astro.
	 *
	 * ```js
	 * {
	 *   site: 'https://www.my-site.dev'
	 * }
	 * ```
	 */
	site?: string;

	/**
	 * @docs
	 * @name base
	 * @type {string}
	 * @description
	 * The base path to deploy to. Astro will use this path as the root for your pages and assets both in development and in production build.
	 *
	 * In the example below, `astro dev` will start your server at `/docs`.
	 *
	 * ```js
	 * {
	 *   base: '/docs'
	 * }
	 * ```
	 *
	 * When using this option, all of your static asset imports and URLs should add the base as a prefix. You can access this value via `import.meta.env.BASE_URL`.
	 *
	 * The value of `import.meta.env.BASE_URL` will be determined by your `trailingSlash` config, no matter what value you have set for `base`.
	 *
	 * A trailing slash is always included if `trailingSlash: "always"` is set. If `trailingSlash: "never"` is set, `BASE_URL` will not include a trailing slash, even if `base` includes one.
	 *
	 * Additionally, Astro will internally manipulate the configured value of `config.base` before making it available to integrations. The value of `config.base` as read by integrations will also be determined by your `trailingSlash` configuration in the same way.
	 *
	 * In the example below, the values of `import.meta.env.BASE_URL` and `config.base` when processed will both be `/docs`:
	 * ```js
	 * {
	 * 	 base: '/docs/',
	 * 	 trailingSlash: "never"
	 * }
	 * ```
	 *
	 * In the example below, the values of `import.meta.env.BASE_URL` and `config.base` when processed will both be `/docs/`:
	 *
	 * ```js
	 * {
	 * 	 base: '/docs',
	 * 	 trailingSlash: "always"
	 * }
	 * ```
	 */
	base?: string;

	/**
	 * @docs
	 * @name trailingSlash
	 * @type {('always' | 'never' | 'ignore')}
	 * @default `'ignore'`
	 * @see build.format
	 * @description
	 *
	 * Set the route matching behavior of the dev server. Choose from the following options:
	 *   - `'always'` - Only match URLs that include a trailing slash (ex: "/foo/")
	 *   - `'never'` - Never match URLs that include a trailing slash (ex: "/foo")
	 *   - `'ignore'` - Match URLs regardless of whether a trailing "/" exists
	 *
	 * Use this configuration option if your production host has strict handling of how trailing slashes work or do not work.
	 *
	 * You can also set this if you prefer to be more strict yourself, so that URLs with or without trailing slashes won't work during development.
	 *
	 * ```js
	 * {
	 *   // Example: Require a trailing slash during development
	 *   trailingSlash: 'always'
	 * }
	 * ```
	 */
	trailingSlash?: 'always' | 'never' | 'ignore';

	/**
	 * @docs
	 * @name redirects
	 * @type {Record<string, RedirectConfig>}
	 * @default `{}`
	 * @version 2.9.0
	 * @description Specify a mapping of redirects where the key is the route to match
	 * and the value is the path to redirect to.
	 *
	 * You can redirect both static and dynamic routes, but only to the same kind of route.
	 * For example you cannot have a `'/article': '/blog/[...slug]'` redirect.
	 *
	 *
	 * ```js
	 * {
	 *   redirects: {
	 *     '/old': '/new',
	 *     '/blog/[...slug]': '/articles/[...slug]',
	 *   }
	 * }
	 * ```
	 *
	 *
	 * For statically-generated sites with no adapter installed, this will produce a client redirect using a [`<meta http-equiv="refresh">` tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#http-equiv) and does not support status codes.
	 *
	 * When using SSR or with a static adapter in `output: static`
	 * mode, status codes are supported.
	 * Astro will serve redirected GET requests with a status of `301`
	 * and use a status of `308` for any other request method.
	 *
	 * You can customize the [redirection status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages) using an object in the redirect config:
	 *
	 * ```js
	 * {
	 *   redirects: {
	 *     '/other': {
	 *       status: 302,
	 *       destination: '/place',
	 *     },
	 *   }
	 * }
	 * ```
	 */
	redirects?: Record<string, RedirectConfig>;

	/**
	 * @docs
	 * @name output
	 * @type {('static' | 'server' | 'hybrid')}
	 * @default `'static'`
	 * @see adapter
	 * @description
	 *
	 * Specifies the output target for builds.
	 *
	 * - `'static'` - Building a static site to be deployed to any static host.
	 * - `'server'` - Building an app to be deployed to a host supporting SSR (server-side rendering).
	 * - `'hybrid'` - Building a static site with a few server-side rendered pages.
	 *
	 * ```js
	 * import { defineConfig } from 'astro/config';
	 *
	 * export default defineConfig({
	 *   output: 'static'
	 * })
	 * ```
	 */
	output?: 'static' | 'server' | 'hybrid';

	/**
	 * @docs
	 * @name adapter
	 * @typeraw {AstroIntegration}
	 * @see output
	 * @description
	 *
	 * Deploy to your favorite server, serverless, or edge host with build adapters. Import one of our first-party adapters for [Netlify](https://docs.astro.build/en/guides/deploy/netlify/#adapter-for-ssr), [Vercel](https://docs.astro.build/en/guides/deploy/vercel/#adapter-for-ssr), and more to engage Astro SSR.
	 *
	 * [See our Server-side Rendering guide](https://docs.astro.build/en/guides/server-side-rendering/) for more on SSR, and [our deployment guides](https://docs.astro.build/en/guides/deploy/) for a complete list of hosts.
	 *
	 * ```js
	 * import netlify from '@astrojs/netlify';
	 * {
	 *   // Example: Build for Netlify serverless deployment
	 *   adapter: netlify(),
	 * }
	 * ```
	 */
	adapter?: AstroIntegration;

	/**
	 * @docs
	 * @name integrations
	 * @typeraw {AstroIntegration[]}
	 * @description
	 *
	 * Extend Astro with custom integrations. Integrations are your one-stop-shop for adding framework support (like Solid.js), new features (like sitemaps), and new libraries (like Partytown).
	 *
	 * Read our [Integrations Guide](https://docs.astro.build/en/guides/integrations-guide/) for help getting started with Astro Integrations.
	 *
	 * ```js
	 * import react from '@astrojs/react';
	 * import tailwind from '@astrojs/tailwind';
	 * {
	 *   // Example: Add React + Tailwind support to Astro
	 *   integrations: [react(), tailwind()]
	 * }
	 * ```
	 */
	integrations?: Array<
		AstroIntegration | (AstroIntegration | false | undefined | null)[] | false | undefined | null
	>;

	/**
	 * @docs
	 * @name root
	 * @cli --root
	 * @type {string}
	 * @default `"."` (current working directory)
	 * @summary Set the project root. The project root is the directory where your Astro project (and all `src`, `public` and `package.json` files) live.
	 * @description  You should only provide this option if you run the `astro` CLI commands in a directory other than the project root directory. Usually, this option is provided via the CLI instead of the [Astro config file](https://docs.astro.build/en/guides/configuring-astro/#supported-config-file-types), since Astro needs to know your project root before it can locate your config file.
	 *
	 * If you provide a relative path (ex: `--root: './my-project'`) Astro will resolve it against your current working directory.
	 *
	 * #### Examples
	 *
	 * ```js
	 * {
	 *   root: './my-project-directory'
	 * }
	 * ```
	 * ```bash
	 * $ astro build --root ./my-project-directory
	 * ```
	 */
	root?: string;

	/**
	 * @docs
	 * @name srcDir
	 * @type {string}
	 * @default `"./src"`
	 * @description Set the directory that Astro will read your site from.
	 *
	 * The value can be either an absolute file system path or a path relative to the project root.
	 *
	 * ```js
	 * {
	 *   srcDir: './www'
	 * }
	 * ```
	 */
	srcDir?: string;

	/**
	 * @docs
	 * @name publicDir
	 * @type {string}
	 * @default `"./public"`
	 * @description
	 * Set the directory for your static assets. Files in this directory are served at `/` during dev and copied to your build directory during build. These files are always served or copied as-is, without transform or bundling.
	 *
	 * The value can be either an absolute file system path or a path relative to the project root.
	 *
	 * ```js
	 * {
	 *   publicDir: './my-custom-publicDir-directory'
	 * }
	 * ```
	 */
	publicDir?: string;

	/**
	 * @docs
	 * @name outDir
	 * @type {string}
	 * @default `"./dist"`
	 * @see build.server
	 * @description Set the directory that `astro build` writes your final build to.
	 *
	 * The value can be either an absolute file system path or a path relative to the project root.
	 *
	 * ```js
	 * {
	 *   outDir: './my-custom-build-directory'
	 * }
	 * ```
	 */
	outDir?: string;

	/**
	 * @docs
	 * @name cacheDir
	 * @type {string}
	 * @default `"./node_modules/.astro"`
	 * @description Set the directory for caching build artifacts. Files in this directory will be used in subsequent builds to speed up the build time.
	 *
	 * The value can be either an absolute file system path or a path relative to the project root.
	 *
	 * ```js
	 * {
	 *   cacheDir: './my-custom-cache-directory'
	 * }
	 * ```
	 */
	cacheDir?: string;

	/**
	 * @docs
	 * @name compressHTML
	 * @type {boolean}
	 * @default `true`
	 * @description
	 *
	 * This is an option to minify your HTML output and reduce the size of your HTML files.
	 *
	 * By default, Astro removes whitespace from your HTML, including line breaks, from `.astro` components in a lossless manner.
	 * Some whitespace may be kept as needed to preserve the visual rendering of your HTML. This occurs both in development mode and in the final build.
	 *
	 * To disable HTML compression, set `compressHTML` to false.
	 *
	 * ```js
	 * {
	 *   compressHTML: false
	 * }
	 * ```
	 */
	compressHTML?: boolean;

	/**
	 * @docs
	 * @name scopedStyleStrategy
	 * @type {('where' | 'class' | 'attribute')}
	 * @default `'attribute'`
	 * @version 2.4
	 * @description
	 *
	 * Specify the strategy used for scoping styles within Astro components. Choose from:
	 *   - `'where'` 		- Use `:where` selectors, causing no specificity increase.
	 *   - `'class'` 		- Use class-based selectors, causing a +1 specificity increase.
	 *   - `'attribute'` 	- Use `data-` attributes, causing a +1 specificity increase.
	 *
	 * Using `'class'` is helpful when you want to ensure that element selectors within an Astro component override global style defaults (e.g. from a global stylesheet).
	 * Using `'where'` gives you more control over specificity, but requires that you use higher-specificity selectors, layers, and other tools to control which selectors are applied.
	 * Using `'attribute'` is useful when you are manipulating the `class` attribute of elements and need to avoid conflicts between your own styling logic and Astro's application of styles.
	 */
	scopedStyleStrategy?: 'where' | 'class' | 'attribute';

	/**
	 * @docs
	 * @name security
	 * @type {boolean}
	 * @default `{}`
	 * @version 4.9.0
	 * @description
	 *
	 * Enables security measures for an Astro website.
	 *
	 * These features only exist for pages rendered on demand (SSR) using `server` mode or pages that opt out of prerendering in `hybrid` mode.
	 *
	 * ```js
	 * // astro.config.mjs
	 * export default defineConfig({
	 *   output: "server",
	 *   security: {
	 *     checkOrigin: true
	 *   }
	 * })
	 * ```
	 */
	security?: {
		/**
		 * @docs
		 * @name security.checkOrigin
		 * @kind h4
		 * @type {boolean}
		 * @default 'true'
		 * @version 4.9.0
		 * @description
		 *
		 * Performs a check that the "origin" header, automatically passed by all modern browsers, matches the URL sent by each `Request`. This is used to provide Cross-Site Request Forgery (CSRF) protection.
		 *
		 * The "origin" check is executed only for pages rendered on demand, and only for the requests `POST`, `PATCH`, `DELETE` and `PUT` with
		 * one of the following `content-type` headers: `'application/x-www-form-urlencoded'`, `'multipart/form-data'`, `'text/plain'`.
		 *
		 * If the "origin" header doesn't match the `pathname` of the request, Astro will return a 403 status code and will not render the page.
		 */

		checkOrigin?: boolean;
	};

	/**
	 * @docs
	 * @name vite
	 * @typeraw {ViteUserConfig}
	 * @description
	 *
	 * Pass additional configuration options to Vite. Useful when Astro doesn't support some advanced configuration that you may need.
	 *
	 * View the full `vite` configuration object documentation on [vitejs.dev](https://vitejs.dev/config/).
	 *
	 * #### Examples
	 *
	 * ```js
	 * {
	 *   vite: {
	 *     ssr: {
	 *       // Example: Force a broken package to skip SSR processing, if needed
	 *       external: ['broken-npm-package'],
	 *     }
	 *   }
	 * }
	 * ```
	 *
	 * ```js
	 * {
	 *   vite: {
	 *     // Example: Add custom vite plugins directly to your Astro project
	 *     plugins: [myPlugin()],
	 *   }
	 * }
	 * ```
	 */
	vite?: ViteUserConfig;

	/**
	 * @docs
	 * @kind heading
	 * @name Build Options
	 */
	build?: {
		/**
		 * @docs
		 * @name build.format
		 * @typeraw {('file' | 'directory' | 'preserve')}
		 * @default `'directory'`
		 * @description
		 * Control the output file format of each page. This value may be set by an adapter for you.
		 *   - `'file'`: Astro will generate an HTML file named for each page route. (e.g. `src/pages/about.astro` and `src/pages/about/index.astro` both build the file `/about.html`)
		 *   - `'directory'`: Astro will generate a directory with a nested `index.html` file for each page. (e.g. `src/pages/about.astro` and `src/pages/about/index.astro` both build the file `/about/index.html`)
		 *   - `'preserve'`: Astro will generate HTML files exactly as they appear in your source folder. (e.g. `src/pages/about.astro` builds `/about.html` and `src/pages/about/index.astro` builds the file `/about/index.html`)
		 *
		 * ```js
		 * {
		 *   build: {
		 *     // Example: Generate `page.html` instead of `page/index.html` during build.
		 *     format: 'file'
		 *   }
		 * }
		 * ```
		 *
		 *
		 *
		 * #### Effect on Astro.url
		 * Setting `build.format` controls what `Astro.url` is set to during the build. When it is:
		 * - `directory` - The `Astro.url.pathname` will include a trailing slash to mimic folder behavior; ie `/foo/`.
		 * - `file` - The `Astro.url.pathname` will include `.html`; ie `/foo.html`.
		 *
		 * This means that when you create relative URLs using `new URL('./relative', Astro.url)`, you will get consistent behavior between dev and build.
		 *
		 * To prevent inconsistencies with trailing slash behaviour in dev, you can restrict the [`trailingSlash` option](#trailingslash) to `'always'` or `'never'` depending on your build format:
		 * - `directory` - Set `trailingSlash: 'always'`
		 * - `file` - Set `trailingSlash: 'never'`
		 */
		format?: 'file' | 'directory' | 'preserve';
		/**
		 * @docs
		 * @name build.client
		 * @type {string}
		 * @default `'./dist/client'`
		 * @description
		 * Controls the output directory of your client-side CSS and JavaScript when `output: 'server'` or `output: 'hybrid'` only.
		 * `outDir` controls where the code is built to.
		 *
		 * This value is relative to the `outDir`.
		 *
		 * ```js
		 * {
		 *   output: 'server', // or 'hybrid'
		 *   build: {
		 *     client: './client'
		 *   }
		 * }
		 * ```
		 */
		client?: string;
		/**
		 * @docs
		 * @name build.server
		 * @type {string}
		 * @default `'./dist/server'`
		 * @description
		 * Controls the output directory of server JavaScript when building to SSR.
		 *
		 * This value is relative to the `outDir`.
		 *
		 * ```js
		 * {
		 *   build: {
		 *     server: './server'
		 *   }
		 * }
		 * ```
		 */
		server?: string;
		/**
		 * @docs
		 * @name build.assets
		 * @type {string}
		 * @default `'_astro'`
		 * @see outDir
		 * @version 2.0.0
		 * @description
		 * Specifies the directory in the build output where Astro-generated assets (bundled JS and CSS for example) should live.
		 *
		 * ```js
		 * {
		 *   build: {
		 *     assets: '_custom'
		 *   }
		 * }
		 * ```
		 */
		assets?: string;
		/**
		 * @docs
		 * @name build.assetsPrefix
		 * @type {string | Record<string, string>}
		 * @default `undefined`
		 * @version 2.2.0
		 * @description
		 * Specifies the prefix for Astro-generated asset links. This can be used if assets are served from a different domain than the current site.
		 *
		 * This requires uploading the assets in your local `./dist/_astro` folder to a corresponding `/_astro/` folder on the remote domain.
		 * To rename the `_astro` path, specify a new directory in `build.assets`.
		 *
		 * To fetch all assets uploaded to the same domain (e.g. `https://cdn.example.com/_astro/...`), set `assetsPrefix` to the root domain as a string (regardless of your `base` configuration):
		 *
		 * ```js
		 * {
		 *   build: {
		 *     assetsPrefix: 'https://cdn.example.com'
		 *   }
		 * }
		 * ```
		 *
		 * **Added in:** `astro@4.5.0`
		 *
		 * You can also pass an object to `assetsPrefix` to specify a different domain for each file type.
		 * In this case, a `fallback` property is required and will be used by default for any other files.
		 *
		 * ```js
		 * {
		 *   build: {
		 *     assetsPrefix: {
		 *       'js': 'https://js.cdn.example.com',
		 *       'mjs': 'https://js.cdn.example.com',
		 *       'css': 'https://css.cdn.example.com',
		 *       'fallback': 'https://cdn.example.com'
		 *     }
		 *   }
		 * }
		 * ```
		 *
		 */
		assetsPrefix?: AssetsPrefix;
		/**
		 * @docs
		 * @name build.serverEntry
		 * @type {string}
		 * @default `'entry.mjs'`
		 * @description
		 * Specifies the file name of the server entrypoint when building to SSR.
		 * This entrypoint is usually dependent on which host you are deploying to and
		 * will be set by your adapter for you.
		 *
		 * Note that it is recommended that this file ends with `.mjs` so that the runtime
		 * detects that the file is a JavaScript module.
		 *
		 * ```js
		 * {
		 *   build: {
		 *     serverEntry: 'main.mjs'
		 *   }
		 * }
		 * ```
		 */
		serverEntry?: string;
		/**
		 * @docs
		 * @name build.redirects
		 * @type {boolean}
		 * @default `true`
		 * @version 2.6.0
		 * @description
		 * Specifies whether redirects will be output to HTML during the build.
		 * This option only applies to `output: 'static'` mode; in SSR redirects
		 * are treated the same as all responses.
		 *
		 * This option is mostly meant to be used by adapters that have special
		 * configuration files for redirects and do not need/want HTML based redirects.
		 *
		 * ```js
		 * {
		 *   build: {
		 *     redirects: false
		 *   }
		 * }
		 * ```
		 */
		redirects?: boolean;
		/**
		 * @docs
		 * @name build.inlineStylesheets
		 * @type {('always' | 'auto' | 'never')}
		 * @default `auto`
		 * @version 2.6.0
		 * @description
		 * Control whether project styles are sent to the browser in a separate css file or inlined into `<style>` tags. Choose from the following options:
		 *  - `'always'` - project styles are inlined into `<style>` tags
		 *  - `'auto'` - only stylesheets smaller than `ViteConfig.build.assetsInlineLimit` (default: 4kb) are inlined. Otherwise, project styles are sent in external stylesheets.
		 *  - `'never'` - project styles are sent in external stylesheets
		 *
		 * ```js
		 * {
		 * 	build: {
		 *		inlineStylesheets: `never`,
		 * 	},
		 * }
		 * ```
		 */
		inlineStylesheets?: 'always' | 'auto' | 'never';
	};

	/**
	 * @docs
	 * @kind heading
	 * @name Server Options
	 * @description
	 *
	 * Customize the Astro dev server, used by both `astro dev` and `astro preview`.
	 *
	 * ```js
	 * {
	 *   server: { port: 1234, host: true}
	 * }
	 * ```
	 *
	 * To set different configuration based on the command run ("dev", "preview") a function can also be passed to this configuration option.
	 *
	 * ```js
	 * {
	 *   // Example: Use the function syntax to customize based on command
	 *   server: ({ command }) => ({ port: command === 'dev' ? 4321 : 4000 })
	 * }
	 * ```
	 */

	/**
	 * @docs
	 * @name server.host
	 * @type {string | boolean}
	 * @default `false`
	 * @version 0.24.0
	 * @description
	 * Set which network IP addresses the server should listen on (i.e. non-localhost IPs).
	 * - `false` - do not expose on a network IP address
	 * - `true` - listen on all addresses, including LAN and public addresses
	 * - `[custom-address]` - expose on a network IP address at `[custom-address]` (ex: `192.168.0.1`)
	 */

	/**
	 * @docs
	 * @name server.port
	 * @type {number}
	 * @default `4321`
	 * @description
	 * Set which port the server should listen on.
	 *
	 * If the given port is already in use, Astro will automatically try the next available port.
	 *
	 * ```js
	 * {
	 *   server: { port: 8080 }
	 * }
	 * ```
	 */

	/**
	 * @docs
	 * @name server.open
	 * @type {string | boolean}
	 * @default `false`
	 * @version 4.1.0
	 * @description
	 * Controls whether the dev server should open in your browser window on startup.
	 *
	 * Pass a full URL string (e.g. "http://example.com") or a pathname (e.g. "/about") to specify the URL to open.
	 *
	 * ```js
	 * {
	 *   server: { open: "/about" }
	 * }
	 * ```
	 */

	/**
	 * @docs
	 * @name server.headers
	 * @typeraw {OutgoingHttpHeaders}
	 * @default `{}`
	 * @version 1.7.0
	 * @description
	 * Set custom HTTP response headers to be sent in `astro dev` and `astro preview`.
	 */

	server?: ServerConfig | ((options: { command: 'dev' | 'preview' }) => ServerConfig);

	/**
	 * @docs
	 * @kind heading
	 * @name Dev Toolbar Options
	 */
	devToolbar?: {
		/**
		 * @docs
		 * @name devToolbar.enabled
		 * @type {boolean}
		 * @default `true`
		 * @description
		 * Whether to enable the Astro Dev Toolbar. This toolbar allows you to inspect your page islands, see helpful audits on performance and accessibility, and more.
		 *
		 * This option is scoped to the entire project, to only disable the toolbar for yourself, run `npm run astro preferences disable devToolbar`. To disable the toolbar for all your Astro projects, run `npm run astro preferences disable devToolbar --global`.
		 */
		enabled: boolean;
	};

	/**
	 * @docs
	 * @kind heading
	 * @name Prefetch Options
	 * @type {boolean | object}
	 * @description
	 * Enable prefetching for links on your site to provide faster page transitions.
	 * (Enabled by default on pages using the `<ViewTransitions />` router. Set `prefetch: false` to opt out of this behaviour.)
	 *
	 * This configuration automatically adds a prefetch script to every page in the project
	 * giving you access to the `data-astro-prefetch` attribute.
	 * Add this attribute to any `<a />` link on your page to enable prefetching for that page.
	 *
	 * ```html
	 * <a href="/about" data-astro-prefetch>About</a>
	 * ```
	 * Further customize the default prefetching behavior using the [`prefetch.defaultStrategy`](#prefetchdefaultstrategy) and [`prefetch.prefetchAll`](#prefetchprefetchall) options.
	 *
	 * See the [Prefetch guide](https://docs.astro.build/en/guides/prefetch/) for more information.
	 */
	prefetch?:
		| boolean
		| {
				/**
				 * @docs
				 * @name prefetch.prefetchAll
				 * @type {boolean}
				 * @description
				 * Enable prefetching for all links, including those without the `data-astro-prefetch` attribute.
				 * This value defaults to `true` when using the `<ViewTransitions />` router. Otherwise, the default value is `false`.
				 *
				 * ```js
				 * prefetch: {
				 * 	prefetchAll: true
				 * }
				 * ```
				 *
				 * When set to `true`, you can disable prefetching individually by setting `data-astro-prefetch="false"` on any individual links.
				 *
				 * ```html
				 * <a href="/about" data-astro-prefetch="false">About</a>
				 *```
				 */
				prefetchAll?: boolean;

				/**
				 * @docs
				 * @name prefetch.defaultStrategy
				 * @type {'tap' | 'hover' | 'viewport' | 'load'}
				 * @default `'hover'`
				 * @description
				 * The default prefetch strategy to use when the `data-astro-prefetch` attribute is set on a link with no value.
				 *
				 * - `'tap'`: Prefetch just before you click on the link.
				 * - `'hover'`: Prefetch when you hover over or focus on the link. (default)
				 * - `'viewport'`: Prefetch as the links enter the viewport.
				 * - `'load'`: Prefetch all links on the page after the page is loaded.
				 *
				 * You can override this default value and select a different strategy for any individual link by setting a value on the attribute.
				 *
				 * ```html
				 * <a href="/about" data-astro-prefetch="viewport">About</a>
				 * ```
				 */
				defaultStrategy?: 'tap' | 'hover' | 'viewport' | 'load';
		  };

	/**
	 * @docs
	 * @kind heading
	 * @name Image Options
	 */
	image?: {
		/**
		 * @docs
		 * @name image.endpoint
		 * @type {string}
		 * @default `undefined`
		 * @version 3.1.0
		 * @description
		 * Set the endpoint to use for image optimization in dev and SSR. Set to `undefined` to use the default endpoint.
		 *
		 * The endpoint will always be injected at `/_image`.
		 *
		 * ```js
		 * {
		 *   image: {
		 *     // Example: Use a custom image endpoint
		 *     endpoint: './src/image-endpoint.ts',
		 *   },
		 * }
		 * ```
		 */
		endpoint?: string;

		/**
		 * @docs
		 * @name image.service
		 * @type {{entrypoint: 'astro/assets/services/sharp' | string, config: Record<string, any>}}
		 * @default `{entrypoint: 'astro/assets/services/sharp', config?: {}}`
		 * @version 2.1.0
		 * @description
		 * Set which image service is used for Astro’s assets support.
		 *
		 * The value should be an object with an entrypoint for the image service to use and optionally, a config object to pass to the service.
		 *
		 * The service entrypoint can be either one of the included services, or a third-party package.
		 *
		 * ```js
		 * {
		 *   image: {
		 *     // Example: Enable the Sharp-based image service with a custom config
		 *     service: {
		 * 			 entrypoint: 'astro/assets/services/sharp',
		 * 			 config: {
		 * 				 limitInputPixels: false,
		 *       },
		 * 		 },
		 *   },
		 * }
		 * ```
		 */
		service?: ImageServiceConfig;
		/**
		 * @docs
		 * @name image.service.config.limitInputPixels
		 * @kind h4
		 * @type {number | boolean}
		 * @default `true`
		 * @version 4.1.0
		 * @description
		 *
		 * Whether or not to limit the size of images that the Sharp image service will process.
		 *
		 * Set `false` to bypass the default image size limit for the Sharp image service and process large images.
		 */

		/**
		 * @docs
		 * @name image.domains
		 * @type {string[]}
		 * @default `{domains: []}`
		 * @version 2.10.10
		 * @description
		 * Defines a list of permitted image source domains for remote image optimization. No other remote images will be optimized by Astro.
		 *
		 * This option requires an array of individual domain names as strings. Wildcards are not permitted. Instead, use [`image.remotePatterns`](#imageremotepatterns) to define a list of allowed source URL patterns.
		 *
		 * ```js
		 * // astro.config.mjs
		 * {
		 *   image: {
		 *     // Example: Allow remote image optimization from a single domain
		 *     domains: ['astro.build'],
		 *   },
		 * }
		 * ```
		 */
		domains?: string[];

		/**
		 * @docs
		 * @name image.remotePatterns
		 * @type {RemotePattern[]}
		 * @default `{remotePatterns: []}`
		 * @version 2.10.10
		 * @description
		 * Defines a list of permitted image source URL patterns for remote image optimization.
		 *
		 * `remotePatterns` can be configured with four properties:
		 * 1. protocol
		 * 2. hostname
		 * 3. port
		 * 4. pathname
		 *
		 * ```js
		 * {
		 *   image: {
		 *     // Example: allow processing all images from your aws s3 bucket
		 *     remotePatterns: [{
		 *       protocol: 'https',
		 *       hostname: '**.amazonaws.com',
		 *     }],
		 *   },
		 * }
		 * ```
		 *
		 * You can use wildcards to define the permitted `hostname` and `pathname` values as described below. Otherwise, only the exact values provided will be configured:
		 * `hostname`:
		 *   - Start with '**.' to allow all subdomains ('endsWith').
		 *   - Start with '*.' to allow only one level of subdomain.
		 *
		 * `pathname`:
		 *   - End with '/**' to allow all sub-routes ('startsWith').
		 *   - End with '/*' to allow only one level of sub-route.

		 */
		remotePatterns?: Partial<RemotePattern>[];
	};

	/**
	 * @docs
	 * @kind heading
	 * @name Markdown Options
	 */
	markdown?: {
		/**
		 * @docs
		 * @name markdown.shikiConfig
		 * @typeraw {Partial<ShikiConfig>}
		 * @description
		 * Shiki configuration options. See [the Markdown configuration docs](https://docs.astro.build/en/guides/markdown-content/#shiki-configuration) for usage.
		 */
		shikiConfig?: Partial<ShikiConfig>;

		/**
		 * @docs
		 * @name markdown.syntaxHighlight
		 * @type {'shiki' | 'prism' | false}
		 * @default `shiki`
		 * @description
		 * Which syntax highlighter to use, if any.
		 * - `shiki` - use the [Shiki](https://shiki.style) highlighter
		 * - `prism` - use the [Prism](https://prismjs.com/) highlighter
		 * - `false` - do not apply syntax highlighting.
		 *
		 * ```js
		 * {
		 *   markdown: {
		 *     // Example: Switch to use prism for syntax highlighting in Markdown
		 *     syntaxHighlight: 'prism',
		 *   }
		 * }
		 * ```
		 */
		syntaxHighlight?: 'shiki' | 'prism' | false;

		/**
		 * @docs
		 * @name markdown.remarkPlugins
		 * @type {RemarkPlugins}
		 * @description
		 * Pass [remark plugins](https://github.com/remarkjs/remark) to customize how your Markdown is built. You can import and apply the plugin function (recommended), or pass the plugin name as a string.
		 *
		 * ```js
		 * import remarkToc from 'remark-toc';
		 * {
		 *   markdown: {
		 *     remarkPlugins: [ [remarkToc, { heading: "contents"} ] ]
		 *   }
		 * }
		 * ```
		 */
		remarkPlugins?: RemarkPlugins;
		/**
		 * @docs
		 * @name markdown.rehypePlugins
		 * @type {RehypePlugins}
		 * @description
		 * Pass [rehype plugins](https://github.com/remarkjs/remark-rehype) to customize how your Markdown's output HTML is processed. You can import and apply the plugin function (recommended), or pass the plugin name as a string.
		 *
		 * ```js
		 * import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
		 * {
		 *   markdown: {
		 *     rehypePlugins: [rehypeAccessibleEmojis]
		 *   }
		 * }
		 * ```
		 */
		rehypePlugins?: RehypePlugins;
		/**
		 * @docs
		 * @name markdown.gfm
		 * @type {boolean}
		 * @default `true`
		 * @version 2.0.0
		 * @description
		 * Astro uses [GitHub-flavored Markdown](https://github.com/remarkjs/remark-gfm) by default. To disable this, set the `gfm` flag to `false`:
		 *
		 * ```js
		 * {
		 *   markdown: {
		 *     gfm: false,
		 *   }
		 * }
		 * ```
		 */
		gfm?: boolean;
		/**
		 * @docs
		 * @name markdown.smartypants
		 * @type {boolean}
		 * @default `true`
		 * @version 2.0.0
		 * @description
		 * Astro uses the [SmartyPants formatter](https://daringfireball.net/projects/smartypants/) by default. To disable this, set the `smartypants` flag to `false`:
		 *
		 * ```js
		 * {
		 *   markdown: {
		 *     smartypants: false,
		 *   }
		 * }
		 * ```
		 */
		smartypants?: boolean;
		/**
		 * @docs
		 * @name markdown.remarkRehype
		 * @type {RemarkRehype}
		 * @description
		 * Pass options to [remark-rehype](https://github.com/remarkjs/remark-rehype#api).
		 *
		 * ```js
		 * {
		 *   markdown: {
		 *     // Example: Translate the footnotes text to another language, here are the default English values
		 *     remarkRehype: { footnoteLabel: "Footnotes", footnoteBackLabel: "Back to reference 1"},
		 *   },
		 * };
		 * ```
		 */
		remarkRehype?: RemarkRehype;
	};

	/**
	 * @docs
	 * @kind heading
	 * @name i18n
	 * @type {object}
	 * @version 3.5.0
	 * @type {object}
	 * @description
	 *
	 * Configures i18n routing and allows you to specify some customization options.
	 *
	 * See our guide for more information on [internationalization in Astro](/en/guides/internationalization/)
	 */
	i18n?: {
		/**
		 * @docs
		 * @name i18n.defaultLocale
		 * @type {string}
		 * @version 3.5.0
		 * @description
		 *
		 * The default locale of your website/application. This is a required field.
		 *
		 * No particular language format or syntax is enforced, but we suggest using lower-case and hyphens as needed (e.g. "es", "pt-br") for greatest compatibility.
		 */
		defaultLocale: string;
		/**
		 * @docs
		 * @name i18n.locales
		 * @type {Locales}
		 * @version 3.5.0
		 * @description
		 *
		 * A list of all locales supported by the website, including the `defaultLocale`. This is a required field.
		 *
		 * Languages can be listed either as individual codes (e.g. `['en', 'es', 'pt-br']`) or mapped to a shared `path` of codes (e.g.  `{ path: "english", codes: ["en", "en-US"]}`). These codes will be used to determine the URL structure of your deployed site.
		 *
		 * No particular language code format or syntax is enforced, but your project folders containing your content files must match exactly the `locales` items in the list. In the case of multiple `codes` pointing to a custom URL path prefix, store your content files in a folder with the same name as the `path` configured.
		 */
		locales: Locales;

		/**
		 * @docs
		 * @name i18n.fallback
		 * @type {Record<string, string>}
		 * @version 3.5.0
		 * @description
		 *
		 * The fallback strategy when navigating to pages that do not exist (e.g. a translated page has not been created).
		 *
		 * Use this object to declare a fallback `locale` route for each language you support. If no fallback is specified, then unavailable pages will return a 404.
		 *
		 * ##### Example
		 *
		 * The following example configures your content fallback strategy to redirect unavailable pages in `/pt-br/` to their `es` version, and unavailable pages in `/fr/` to their `en` version. Unavailable `/es/` pages will return a 404.
		 *
		 * ```js
		 * export default defineConfig({
		 * 	i18n: {
		 * 		defaultLocale: "en",
		 * 		locales: ["en", "fr", "pt-br", "es"],
		 * 		fallback: {
		 * 			pt: "es",
		 * 		  fr: "en"
		 * 		}
		 * 	}
		 * })
		 * ```
		 */
		fallback?: Record<string, string>;

		/**
		 * @docs
		 * @name i18n.routing
		 * @type {Routing}
		 * @version 3.7.0
		 * @description
		 *
		 * Controls the routing strategy to determine your site URLs. Set this based on your folder/URL path configuration for your default language.
		 *
		 */
		routing?:
			| {
					/**
					 * @docs
					 * @name i18n.routing.prefixDefaultLocale
					 * @kind h4
					 * @type {boolean}
					 * @default `false`
					 * @version 3.7.0
					 * @description
					 *
					 * When `false`, only non-default languages will display a language prefix.
					 * The `defaultLocale` will not show a language prefix and content files do not exist in a localized folder.
					 *  URLs will be of the form `example.com/[locale]/content/` for all non-default languages, but `example.com/content/` for the default locale.
					 *
					 * When `true`, all URLs will display a language prefix.
					 * URLs will be of the form `example.com/[locale]/content/` for every route, including the default language.
					 * Localized folders are used for every language, including the default.
					 *
					 * ```js
					 * export default defineConfig({
					 * 	i18n: {
					 * 		defaultLocale: "en",
					 * 		locales: ["en", "fr", "pt-br", "es"],
					 * 		routing: {
					 * 			prefixDefaultLocale: true,
					 * 		}
					 * 	}
					 * })
					 * ```
					 */
					prefixDefaultLocale?: boolean;

					/**
					 * @docs
					 * @name i18n.routing.redirectToDefaultLocale
					 * @kind h4
					 * @type {boolean}
					 * @default `true`
					 * @version 4.2.0
					 * @description
					 *
					 * Configures whether or not the home URL (`/`) generated by `src/pages/index.astro`
					 * will redirect to `/[defaultLocale]` when `prefixDefaultLocale: true` is set.
					 *
					 * Set `redirectToDefaultLocale: false` to disable this automatic redirection at the root of your site:
					 * ```js
					 * // astro.config.mjs
					 * export default defineConfig({
					 *   i18n:{
					 *     defaultLocale: "en",
					 * 		locales: ["en", "fr"],
					 *     routing: {
					 *       prefixDefaultLocale: true,
					 *       redirectToDefaultLocale: false
					 *     }
					 *   }
					 * })
					 *```
					 * */
					redirectToDefaultLocale?: boolean;

					/**
					 * @docs
					 * @name i18n.routing.fallbackType
					 * @kind h4
					 * @type {"redirect" | "rewrite"}
					 * @default `"redirect"`
					 * @version 4.15.0
					 * @description
					 *
					 * When [`i18n.fallback`](#i18nfallback) is configured to avoid showing a 404 page for missing page routes, this option controls whether to [redirect](https://docs.astro.build/en/guides/routing/#redirects) to the fallback page, or to [rewrite](https://docs.astro.build/en/guides/routing/#rewrites) the fallback page's content in place.
					 *
					 * By default, Astro's i18n routing creates pages that redirect your visitors to a new destination based on your fallback configuration. The browser will refresh and show the destination address in the URL bar.
					 *
					 * When `i18n.routing.fallback: "rewrite"` is configured, Astro will create pages that render the contents of the fallback page on the original, requested URL.
					 *
					 * With the following configuration, if you have the file `src/pages/en/about.astro` but not `src/pages/fr/about.astro`, the `astro build` command will generate `dist/fr/about.html` with the same content as the `dist/en/index.html` page.
					 * Your site visitor will see the English version of the page at `https://example.com/fr/about/` and will not be redirected.
					 *
					 * ```js
					 * //astro.config.mjs
					 * export default defineConfig({
					 * 	 i18n: {
					 *     defaultLocale: "en",
					 *     locales: ["en", "fr"],
					 *     routing: {
					 *     	prefixDefaultLocale: false,
					 *     	fallbackType: "rewrite",
					 *     },
					 *     fallback: {
					 *     	fr: "en",
					 *     }
					 *   },
					 * })
					 * ```
					 */
					fallbackType: 'redirect' | 'rewrite';

					/**
					 * @name i18n.routing.strategy
					 * @type {"pathname"}
					 * @default `"pathname"`
					 * @version 3.7.0
					 * @description
					 *
					 * - `"pathname": The strategy is applied to the pathname of the URLs
					 */
					strategy?: 'pathname';
			  }
			/**
			 *
			 * @docs
			 * @name i18n.routing.manual
			 * @kind h4
			 * @type {string}
			 * @version 4.6.0
			 * @description
			 * When this option is enabled, Astro will **disable** its i18n middleware so that you can implement your own custom logic. No other `routing` options (e.g. `prefixDefaultLocale`) may be configured with `routing: "manual"`.
			 *
			 * You will be responsible for writing your own routing logic, or executing Astro's i18n middleware manually alongside your own.
			 *
			 * ```js
			 * export default defineConfig({
			 * 	i18n: {
			 * 		defaultLocale: "en",
			 * 		locales: ["en", "fr", "pt-br", "es"],
			 * 		routing: {
			 * 			prefixDefaultLocale: true,
			 * 		}
			 * 	}
			 * })
			 * ```
			 */
			| 'manual';

		/**
		 * @name i18n.domains
		 * @type {Record<string, string> }
		 * @default '{}'
		 * @version 4.3.0
		 * @description
		 *
		 * Configures the URL pattern of one or more supported languages to use a custom domain (or sub-domain).
		 *
		 * When a locale is mapped to a domain, a `/[locale]/` path prefix will not be used.
		 * However, localized folders within `src/pages/` are still required, including for your configured `defaultLocale`.
		 *
		 * Any other locale not configured will default to a localized path-based URL according to your `prefixDefaultLocale` strategy (e.g. `https://example.com/[locale]/blog`).
		 *
		 * ```js
		 * //astro.config.mjs
		 * export default defineConfig({
		 * 	 site: "https://example.com",
		 * 	 output: "server", // required, with no prerendered pages
		 *   adapter: node({
		 *     mode: 'standalone',
		 *   }),
		 * 	 i18n: {
		 *     defaultLocale: "en",
		 *     locales: ["en", "fr", "pt-br", "es"],
		 *     prefixDefaultLocale: false,
		 *     domains: {
		 *       fr: "https://fr.example.com",
		 *       es: "https://example.es"
		 *     }
		 *   },
		 * })
		 * ```
		 *
		 * Both page routes built and URLs returned by the `astro:i18n` helper functions [`getAbsoluteLocaleUrl()`](https://docs.astro.build/en/reference/api-reference/#getabsolutelocaleurl) and [`getAbsoluteLocaleUrlList()`](https://docs.astro.build/en/reference/api-reference/#getabsolutelocaleurllist) will use the options set in `i18n.domains`.
		 *
		 * See the [Internationalization Guide](https://docs.astro.build/en/guides/internationalization/#domains) for more details, including the limitations of this feature.
		 */
		domains?: Record<string, string>;
	};

	/** ! WARNING: SUBJECT TO CHANGE */
	db?: Config.Database;

	/**
	 * @docs
	 * @name env
	 * @type {object}
	 * @default `{}`
	 * @version 5.0.0
	 * @description
	 *
	 * Holds `astro:env` options.
	 */
	env?: {
		/**
		 * @docs
		 * @name env.schema
		 * @type {EnvSchema}
		 * @default `{}`
		 * @version 5.0.0
		 * @description
		 *
		 * An object that uses `envField` to define the data type (`string`, `number`, or `boolean`) and properties of your environment variables: `context` (client or server), `access` (public or secret), a `default` value to use, and whether or not this environment variable is `optional` (defaults to `false`).
		 * ```js
		 * // astro.config.mjs
		 * import { defineConfig, envField } from "astro/config"
		 *
		 * export default defineConfig({
		 *   env: {
		 *     schema: {
		 *       API_URL: envField.string({ context: "client", access: "public", optional: true }),
		 *       PORT: envField.number({ context: "server", access: "public", default: 4321 }),
		 *       API_SECRET: envField.string({ context: "server", access: "secret" }),
		 *     }
		 *   }
		 * })
		 * ```
		 */
		schema?: EnvSchema;

		/**
		 * @docs
		 * @name env.validateSecrets
		 * @type {boolean}
		 * @default `false`
		 * @version 5.0.0
		 * @description
		 *
		 * Whether or not to validate secrets on the server when starting the dev server or running a build.
		 *
		 * By default, only public variables are validated on the server when starting the dev server or a build, and private variables are validated at runtime only. If enabled, private variables will also be checked on start. This is useful in some continuous integration (CI) pipelines to make sure all your secrets are correctly set before deploying.
		 *
		 * ```js
		 * // astro.config.mjs
		 * import { defineConfig, envField } from "astro/config"
		 *
		 * export default defineConfig({
		 *   env: {
		 *     schema: {
		 *       // ...
		 *     },
		 *     validateSecrets: true
		 *   }
		 * })
		 * ```
		 */
		validateSecrets?: boolean;
	};

	/**
	 * @docs
	 * @kind heading
	 * @name Legacy Flags
	 * @description
	 * To help some users migrate between versions of Astro, we occasionally introduce `legacy` flags.
	 * These flags allow you to opt in to some deprecated or otherwise outdated behavior of Astro
	 * in the latest version, so that you can continue to upgrade and take advantage of new Astro releases.
	 */
	legacy?: object;

	/**
	 * @docs
	 * @kind heading
	 * @name Experimental Flags
	 * @description
	 * Astro offers experimental flags to give users early access to new features.
	 * These flags are not guaranteed to be stable.
	 */
	experimental?: {
		/**
		 * @docs
		 * @name experimental.contentCollectionCache
		 * @type {boolean}
		 * @default `false`
		 * @version 3.5.0
		 * @description
		 * Enables a persistent cache for content collections when building in static mode.
		 *
		 * ```js
		 * {
		 * 	experimental: {
		 * 		contentCollectionCache: true,
		 * 	},
		 * }
		 * ```
		 */
		contentCollectionCache?: boolean;

		/**
		 * @docs
		 * @name experimental.clientPrerender
		 * @type {boolean}
		 * @default `false`
		 * @version 4.2.0
		 * @description
		 * Enables pre-rendering your prefetched pages on the client in supported browsers.
		 *
		 * This feature uses the experimental [Speculation Rules Web API](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API) and enhances the default `prefetch` behavior globally to prerender links on the client.
		 * You may wish to review the [possible risks when prerendering on the client](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API#unsafe_prefetching) before enabling this feature.
		 *
		 * Enable client side prerendering in your `astro.config.mjs` along with any desired `prefetch` configuration options:
		 *
		 * ```js
		 * // astro.config.mjs
		 * {
		 *   prefetch: {
		 *     prefetchAll: true,
		 *     defaultStrategy: 'viewport',
		 *   },
		 * 	experimental: {
		 * 		clientPrerender: true,
		 * 	},
		 * }
		 * ```
		 *
		 * Continue to use the `data-astro-prefetch` attribute on any `<a />` link on your site to opt in to prefetching.
		 * Instead of appending a `<link>` tag to the head of the document or fetching the page with JavaScript, a `<script>` tag will be appended with the corresponding speculation rules.
		 *
		 * Client side prerendering requires browser support. If the Speculation Rules API is not supported, `prefetch` will fallback to the supported strategy.
		 *
		 * See the [Prefetch Guide](https://docs.astro.build/en/guides/prefetch/) for more `prefetch` options and usage.
		 */
		clientPrerender?: boolean;

		/**
		 * @docs
		 * @name experimental.serverIslands
		 * @type {boolean}
		 * @default `false`
		 * @version 4.12.0
		 * @description
		 *
		 * Enables experimental Server Island features.
		 * Server Islands offer the ability to defer a component to render asynchronously after the page has already rendered.
		 *
		 * To enable, configure an [on-demand server rendering `output` mode](https://docs.astro.build/en/basics/rendering-modes/#on-demand-rendered) with an adapter, and add the `serverIslands` flag to the `experimental` object:
		 *
		 * ```js
		 * {
		 *   output: 'hybrid', // or 'server'
		 *   adapter: nodejs({ mode: 'standalone' }),
		 *   experimental: {
		 *     serverIslands: true,
		 *   },
		 * }
		 * ```
		 *
		 * Use the `server:defer` directive on any Astro component to delay initial rendering:
		 *
		 * ```astro "server:defer"
		 * ---
		 * import Avatar from '~/components/Avatar.astro';
		 * ---
		 * <Avatar server:defer />
		 * ```
		 *
		 * The outer page will be rendered, either at build time (`hybrid`) or at runtime (`server`) with the island content omitted and a `<script>` tag included in its place.
		 *
		 * After the page loads in the browser, the script tag will replace itself with the the contents of the island by making a request.
		 *
		 * Any Astro component can be given the `server: defer` attribute to delay its rendering. There is no special API and you can write `.astro` code as normal:
		 *
		 * ```astro
		 * ---
		 * import { getUser } from '../api';
		 *
		 * const user = await getUser(Astro.locals.userId);
		 * ---
		 * <img class="avatar" src={user.imageUrl}>
		 * ```
		 *
		 * #### Server island fallback content
		 *
		 * Since your component will not render with the rest of the page, you may want to add generic content (e.g. a loading message) to temporarily show in its place. This content will be displayed when the page first renders but before the island has loaded.
		 *
		 * Add placeholder content as a child of your Astro component with the `slot="fallback"` attribute. When your island content is available, the fallback content will be replaced.
		 *
		 * The example below displays a generic avatar as fallback content, then animates into a personalized avatar using view transitions:
		 *
		 * ```astro
		 * <Avatar server:defer>
		 *   <svg slot="fallback" class="generic-avatar" transition:name="avatar">...</svg>
		 * </Avatar>
		 * ```
		 *
		 * For a complete overview, and to give feedback on this experimental API, see the [Server Islands RFC](https://github.com/withastro/roadmap/pull/963).
		 */
		serverIslands?: boolean;

		/**
		 * @docs
		 * @name experimental.contentIntellisense
		 * @type {boolean}
		 * @default `false`
		 * @version 4.14.0
		 * @description
		 *
		 * Enables Intellisense features (e.g. code completion, quick hints) for your content collection entries in compatible editors.
		 *
		 * When enabled, this feature will generate and add JSON schemas to the `.astro` directory in your project. These files can be used by the Astro language server to provide Intellisense inside content files (`.md`, `.mdx`, `.mdoc`).
		 *
		 * ```js
		 * {
		 *   experimental: {
		 *     contentIntellisense: true,
		 *   },
		 * }
		 * ```
		 *
		 * To use this feature with the Astro VS Code extension, you must also enable the `astro.content-intellisense` option in your VS Code settings. For editors using the Astro language server directly, pass the `contentIntellisense: true` initialization parameter to enable this feature.
		 */
		contentIntellisense?: boolean;

		/**
		 * @docs
		 * @name experimental.contentLayer
		 * @type {boolean}
		 * @default `false`
		 * @version 4.14.0
		 * @description
		 *
		 * The Content Layer API is a new way to handle content and data in Astro. It is similar to and builds upon [content collections](/en/guides/content-collections/), taking them beyond local files in `src/content/` and allowing you to fetch content from anywhere, including remote APIs, by adding a `loader` to your collection.
		 *
		 * Your existing content collections can be [migrated to the Content Layer API](#migrating-an-existing-content-collection-to-use-the-content-layer-api) with a few small changes. However, it is not necessary to update all your collections at once to add a new collection powered by the Content Layer API. You may have collections using both the existing and new APIs defined in `src/content/config.ts` at the same time.
		 *
		 * The Content Layer API is designed to be more powerful and more performant, helping sites scale to thousands of pages. Data is cached between builds and updated incrementally. Markdown parsing is also 5-10 times faster, with similar scale reductions in memory, and MDX is 2-3 times faster.
		 *
		 * To enable, add the `contentLayer` flag to the `experimental` object in your Astro config:
		 *
		 * ```js
		 * // astro.config.mjs
		 * {
		 * 	experimental: {
		 * 		contentLayer: true,
		 * 	}
		 * }
		 * ```
		 *
		 * #### Fetching data with a `loader`
		 *
		 * The Content Layer API allows you to fetch your content from outside of the `src/content/` folder (whether stored locally in your project or remotely) and uses a `loader` property to retrieve your data.
		 *
		 * The `loader` is defined in the collection's schema and returns an array of entries. Astro provides two built-in loader functions (`glob()` and `file()`) for fetching your local content, as well as access to the API to [construct your own loader and fetch remote data](#creating-a-loader).
		 *
		 * The `glob()` loader creates entries from directories of Markdown, MDX, Markdoc, or JSON files from anywhere on the filesystem. It accepts a `pattern` of entry files to match, and a `base` file path of where your files are located. Use this when you have one file per entry.
		 *
		 * The `file()` loader creates multiple entries from a single local file. Use this when all your entries are stored in an array of objects.
		 *
		 * ```ts  {3,8,19}
		 * // src/content/config.ts
		 * import { defineCollection, z } from 'astro:content';
		 * import { glob, file } from 'astro/loaders';
		 *
		 * const blog = defineCollection({
		 *   // By default the ID is a slug generated from
		 *   // the path of the file relative to `base`
		 *   loader: glob({ pattern: "**\/*.md", base: "./src/data/blog" }),
		 *   schema: z.object({
		 *     title: z.string(),
		 *     description: z.string(),
		 *     pubDate: z.coerce.date(),
		 *     updatedDate: z.coerce.date().optional(),
		 *   })
		 * });
		 *
		 * const dogs = defineCollection({
		 *   // The path is relative to the project root, or an absolute path.
		 *   loader: file("src/data/dogs.json"),
		 *   schema: z.object({
		 *     id: z.string(),
		 *     breed: z.string(),
		 *     temperament: z.array(z.string()),
		 *   }),
		 * });
		 *
		 * export const collections = { blog, dogs };
		 * ```
		 *
		 * :::note
		 * Loaders will not automatically [exclude files prefaced with an `_`](/en/guides/routing/#excluding-pages). Use a regular expression such as `pattern: '**\/[^_]*.md'` in your loader to ignore these files.
		 * :::
		 *
		 * #### Querying and rendering with the Content Layer API
		 *
		 * The collection can be [queried in the same way as content collections](/en/guides/content-collections/#querying-collections):
		 *
		 * ```ts
		 * // src/pages/index.astro
		 * import { getCollection, getEntry } from 'astro:content';
		 *
		 * // Get all entries from a collection.
		 * // Requires the name of the collection as an argument.
		 * const allBlogPosts = await getCollection('blog');
		 *
		 * // Get a single entry from a collection.
		 * // Requires the name of the collection and ID
		 * const labradorData = await getEntry('dogs', 'labrador-retriever');
		 * ```
		 *
		 * Entries generated from Markdown, MDX, or Markdoc can be rendered directly to a page using the `render()` function.
		 *
		 * :::note
		 * The syntax for rendering collection entries is different from the current content collections syntax.
		 * :::
		 *
		 * ```astro title="src/pages/[slug].astro"
		 * ---
		 * import { getEntry, render } from 'astro:content';
		 *
		 * const post = await getEntry('blog', Astro.params.slug);
		 *
		 * const { Content, headings } = await render(post);
		 * ---
		 *
		 * <Content />
		 * ```
		 *
		 * #### Creating a loader
		 *
		 * With the Content Layer API, you can build loaders to load or generate content from anywhere.
		 *
		 * For example, you can create a loader that fetches collection entries from a remote API.
		 *
		 * ```ts
		 * // src/content/config.ts
		 * const countries = defineCollection({
		 *   loader: async () => {
		 *     const response = await fetch("https://restcountries.com/v3.1/all");
		 *     const data = await response.json();
		 *     // Must return an array of entries with an id property,
		 *     // or an object with IDs as keys and entries as values
		 *     return data.map((country) => ({
		 *       id: country.cca3,
		 *       ...country,
		 *     }));
		 *   },
		 *   // optionally add a schema
		 *   // schema: z.object...
		 * });
		 *
		 * export const collections = { countries };
		 * ```
		 *
		 * For more advanced loading logic, you can define an object loader. This allows incremental updates and conditional loading while also giving full access to the data store. See the API in [the Content Layer API RFC](https://github.com/withastro/roadmap/blob/content-layer/proposals/0047-content-layer.md#loaders).
		 *
		 * #### Migrating an existing content collection to use the Content Layer API
		 *
		 * You can convert an existing content collection with Markdown, MDX, Markdoc, or JSON entries to use the Content Layer API.
		 *
		 * 1. **Move the collection folder out of `src/content/`** (e.g. to `src/data/`). All collections located in the `src/content/` folder will use the existing Content Collections API.
		 *
		 *     **Do not move the existing `src/content/config.ts` file**. This file will define all collections, using either API.
		 *
		 * 2. **Edit the collection definition**. Your updated collection requires a `loader`, and the option to select a collection `type` is no longer available.
		 *
		 *     ```ts ins={3,8} del={7}
		 *     // src/content/config.ts
		 *     import { defineCollection, z } from 'astro:content';
		 *     import { glob } from 'astro/loaders';
		 *
		 *     const blog = defineCollection({
		 *       // For content layer you no longer define a `type`
		 *       type: 'content',
		 *       loader: glob({ pattern: '**\/[^_]*.md', base: "./src/data/blog" }),
		 *       schema: z.object({
		 *         title: z.string(),
		 *         description: z.string(),
		 *         pubDate: z.coerce.date(),
		 *         updatedDate: z.coerce.date().optional(),
		 *       }),
		 *     });
		 *     ```
		 *
		 * 3. **Change references from `slug` to `id`**. Content layer collections do not have a `slug` field. Instead, all updated collections will have an `id`.
		 *
		 *     ```astro ins={7} del={6}
		 *     // src/pages/index.astro
		 *     ---
		 *     export async function getStaticPaths() {
		 *       const posts = await getCollection('blog');
		 *       return posts.map((post) => ({
		 *         params: { slug: post.slug },
		 *         params: { slug: post.id },
		 *         props: post,
		 *       }));
		 *     }
		 *     ---
		 *     ```
		 *
		 * 4. **Switch to the new `render()` function**. Entries no longer have a `render()` method, as they are now serializable plain objects. Instead, import the `render()` function from `astro:content`.
		 *
		 *     ```astro ins={4,9} del={3,8}
		 *     // src/pages/index.astro
		 *     ---
		 *     import { getEntry } from 'astro:content';
		 *     import { getEntry, render } from 'astro:content';
		 *
		 *     const post = await getEntry('blog', params.slug);
		 *
		 *     const { Content, headings } = await post.render();
		 *     const { Content, headings } = await render(post);
		 *     ---
		 *
		 *     <Content />
		 *     ```
		 *
		 * #### Learn more
		 *
		 * For a complete overview and the full API reference, see [the Content Layer API RFC](https://github.com/withastro/roadmap/blob/content-layer/proposals/0047-content-layer.md) and [share your feedback](https://github.com/withastro/roadmap/pull/982).
		 */
		contentLayer?: boolean;
	};
}

/**
 * Resolved Astro Config
 *
 * Config with user settings along with all defaults filled in.
 */
export interface AstroConfig extends AstroConfigType {
	// Public:
	// This is a more detailed type than zod validation gives us.
	// TypeScript still confirms zod validation matches this type.
	integrations: AstroIntegration[];
}
/**
 * An inline Astro config that takes highest priority when merging with the user config,
 * and includes inline-specific options to configure how Astro runs.
 */
export interface AstroInlineConfig extends AstroUserConfig, AstroInlineOnlyConfig {}
export interface AstroInlineOnlyConfig {
	/**
	 * A custom path to the Astro config file. If relative, it'll resolve based on the current working directory.
	 * Set to false to disable loading any config files.
	 *
	 * If this value is undefined or unset, Astro will search for an `astro.config.(js,mjs,ts)` file relative to
	 * the `root` and load the config file if found.
	 *
	 * The inline config passed in this object will take the highest priority when merging with the loaded user config.
	 */
	configFile?: string | false;
	/**
	 * The mode used when building your site to generate either "development" or "production" code.
	 */
	mode?: RuntimeMode;
	/**
	 * The logging level to filter messages logged by Astro.
	 * - "debug": Log everything, including noisy debugging diagnostics.
	 * - "info": Log informational messages, warnings, and errors.
	 * - "warn": Log warnings and errors.
	 * - "error": Log errors only.
	 * - "silent": No logging.
	 *
	 * @default "info"
	 */
	logLevel?: LoggerLevel;
	/**
	 * Clear the content layer cache, forcing a rebuild of all content entries.
	 */
	force?: boolean;
	/**
	 * @internal for testing only, use `logLevel` instead.
	 */
	logger?: Logger;
}

// HACK! astro:db augment this type that is used in the config
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Config {
		type Database = Record<string, any>;
	}
}