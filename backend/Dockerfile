FROM python:3.11-slim

WORKDIR /app

# Python 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip uninstall -y opencv-python opencv-python-headless opencv-contrib-python && \
    pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 8000

# 실행
CMD ["python3", "main.py"]