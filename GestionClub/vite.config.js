import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
export default defineConfig({
  base: "/Front-end-GestionClub/",
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "src/certs/localhost-key.pem")
      ),
      cert: fs.readFileSync(path.resolve(__dirname, "src/certs/localhost.pem")),
    },
    port: 5173,
    host: "localhost",
  },
});
