import path from "path"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [tsconfigPaths()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },

  test: {
    // Archivos de setup que corren ANTES de cada archivo de test
    environment: "node",

    // describe / it / expect / vi disponibles globalmente sin import en cada test
    globals: true,

    // Archivos de setup que corren ANTES de cada archivo de test
    setupFiles: ["./testing/helpers/setup.ts"],

    // Patrón de archivos de test — busca en src/ ignorando node_modules y .next
    include: ["./**/*.{test,spec}.ts"],
    exclude: ["node_modules", ".next", "app/**"],

    // Cobertura — solo capa de application y domain (la lógica de negocio pura)
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: ["modules/**/application/**/*.ts", "modules/**/domain/**/*.ts"],
      exclude: [
        "**/*.d.ts",
        "**/index.ts",
        "**/*.entity.ts",
        "**/*-Errors.ts",
        "**/I*.ts",
      ],
      thresholds: {
        // Umbrales mínimos — el build falla si no se alcanzan
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },

    // Timeout por test — suficiente para operaciones async pero que falle rápido
    testTimeout: 5000,

    // Mostrar cada test individualmente en la terminal
    reporters: "verbose",
  },
})
