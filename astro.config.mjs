// @ts-check
// @ts-ignore
import { defineConfig } from 'astro/config';

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://gongdoli2.github.io/",
  adapter: netlify()
});