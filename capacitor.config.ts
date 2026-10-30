import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.datamanagement.archive',
  appName: 'Data Management',
  webDir: 'dist',
  android: {
    backgroundColor: '#F2F0EA',
    allowMixedContent: false,
  },
};

export default config;
