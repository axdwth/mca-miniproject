import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
server: {
  host: '0.0.0.0',
  allowedHosts: ['2064410bf2b6.ngrok-free.app']
}
})
