import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    nitro({
      routeRules: {
        "/days-in-canada": { redirect: { to: "/days-gone", status: 301 } },
        "/projects/days-in-canada": {
          redirect: { to: "/projects/days-gone", status: 301 },
        },
        "/experience": { redirect: { to: "/projects", status: 301 } },
        "/contact": { redirect: { to: "/about", status: 301 } },
      },
    }),
    viteReact(),
  ],
})

export default config
