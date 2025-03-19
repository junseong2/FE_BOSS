
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
;

export default defineConfig({
  plugins: [    tailwindcss(),
    react()
],
  server: {
    port: 5173, // Vite의 기본 포트
    strictPort: true, // 포트가 사용 중이면 종료
    host: '0.0.0.0', // Docker 컨테이너 내부에서도 접근 가능하도록 설정
    watch: {
      usePolling: true, // 파일 변경 감지를 위한 옵션 (Docker 환경 필수)
    },
  },
});
