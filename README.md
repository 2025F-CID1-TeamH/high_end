# high-end: raspberripi 4

**react (fe) + python, fastapi (be)**

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