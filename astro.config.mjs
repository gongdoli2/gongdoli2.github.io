import { defineConfig } from 'astro/config';

import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://gongdoli2.github.io/",
  adapter: netlify()
});