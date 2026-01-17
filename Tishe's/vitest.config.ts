import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // 1. Specifies the environment (requires: npm install jsdom)
    environment: 'jsdom',
    
    // 2. Makes 'describe', 'it', 'expect' available without imports
    globals: true, 
    
    // 3. Loads custom matchers like .toBeInTheDocument()
    setupFiles: './tests/setup.ts', 
  },
});