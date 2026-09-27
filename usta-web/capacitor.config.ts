import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'io.github.faikemrepusat.usta',
  appName: 'Usta',
  // Built with the default base "/" (not the Pages /usta/ base).
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      iconColor: '#c9a45c',
    },
  },
}

export default config
