import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.puzzle.app',
  appName: 'Puzzle',
  webDir: 'dist/puzzle-app',
  server: {
    androidScheme: 'https',
  },
};

export default config;
