import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'desktop' },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  testDir: 'tests/browser',
  use: { baseURL: 'http://127.0.0.1:4193', reducedMotion: 'reduce' },
  webServer: {
    command: 'npm exec vite -- build --outDir node_modules/.cache/portfolio-smoke && npm exec vite -- preview --outDir node_modules/.cache/portfolio-smoke --host 127.0.0.1 --port 4193 --strictPort',
    url: 'http://127.0.0.1:4193',
    env: { VITE_SUPABASE_URL: 'https://fixture.invalid', VITE_SUPABASE_ANON_KEY: 'fixture-key' },
  },
});
