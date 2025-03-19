# 1. Node.js 이미지 사용
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json 및 package-lock.json 복사 (캐시 최적화)
COPY package.json package-lock.json ./

# 4. 의존성 설치
RUN npm install

# 5. 나머지 프로젝트 파일 복사
COPY . . 

# 6. 포트 노출 (Vite 기본 포트 5173)
EXPOSE 5173

# 7. 개발 서버 실행
CMD ["npm", "run", "dev"]
