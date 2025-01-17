import { Config } from "tailwindcss"
import sharedConfig from "@workspace/ui/tailwind.config"

const config: Config = {
  ...sharedConfig,
  content: [
    ...sharedConfig.content,
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
}

export default config