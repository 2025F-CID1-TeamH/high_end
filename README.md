# high-end: raspberripi 4

**react (fe) + python, fastapi (be)**

1. docker 실행되는지 확인
2. docker 명령어로 환경 설치, 실행 가능
```
# 빌드 & 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 중지
docker-compose down

# 로그 확인
docker-compose logs -f

# 특정 서비스만 재시작
docker-compose restart backend
docker-compose restart frontend
```
<details>
<summary> 구버전 </summary>

### 1. 필수 패키지 설치
```
sudo apt update
sudo apt install -y python3 python3-venv python3-pip npm 
```

### 2. 환경 설정
```
// backend(fastapi): venv로 가상환경 설정
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
// frontend(react): npm으로 필요한 package 설치/update
cd ../frontend
npm install
```

### 3. 실행
```
// 현재 폴더: frontend
npm start 
// 현재 폴더: backend
python3 ../backend/main.py
```
</details>