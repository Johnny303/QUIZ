import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Include this if using React

export default defineConfig({
  base: '/QUIZ/', // Replace <REPO_NAME> with your GitHub repository name
  plugins: [react()] // Include this line if using React
});
