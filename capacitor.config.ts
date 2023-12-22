import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.photoflare.app',
  appName: 'PhotoFlare',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
