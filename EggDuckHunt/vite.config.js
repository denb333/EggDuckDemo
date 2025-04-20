import { defineConfig } from "vite";
import del from 'rollup-plugin-delete';
export default defineConfig({
  plugins: [
    del({ targets: ["dist/*"], ignore: ["dist/assets"], runOnce: true }),
    del({ targets: ["dist/*"],   ignore: ["dist/assets", "dist/index"],runOnce: true, hook: "buildEnd" }),
  ],
  // Server Configuration
  base: "/DuckEggHunt/",
  mode: "development",
 server:{
  open:true,
  port:2900,
  watch:{
    usePolling:true
  }
 },
 // Build Configuration
 build: {
  outDir: "dist",
  assetsDir: "",
  minify: false,
  emptyOutDir: true,
  copyPublicDir: true,
  chunkSizeWarningLimit: 1024*2,
},
  publicDir: "assets", // This will copy the assets folder to the dist folder
});