import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Docker 컨테이너에서도 접근 가능하게 설정
    port: 5173,
    strictPort: true, // 포트 충돌 방지
    watch: {
      usePolling: true, // Docker 환경에서 파일 변경 감지 활성화
    },
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
    },
  },
  define: {
    'process.env': {},
  },
});
