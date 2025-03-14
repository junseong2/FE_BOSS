# 1. Node.js 이미지 사용
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 파일(package.json, package-lock.json)을 컨테이너로 복사
COPY package.json package-lock.json /app/

# 4. 의존성 설치
RUN npm install

# 5. crypto-browserify 설치
RUN npm install crypto-browserify stream-browserify

# 6. 나머지 프로젝트 파일 복사
COPY . /app/

# 7. React 애플리케이션 실행 (개발 서버 실행)
CMD ["npm", "run", "dev"]

# 8. 외부에 노출할 포트 설정 (React 개발 서버 포트 5173)
EXPOSE 5173
