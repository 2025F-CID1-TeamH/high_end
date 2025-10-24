from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import paho.mqtt.client as mqtt
import json
import logging
from collections import deque
from datetime import datetime
import base64
import os
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, # TODO: 개발용, 배포시 수정
    allow_methods=["*"],
    allow_headers=["*"],
)

mqtt_client = None
events = deque(maxlen=100)
stats = {
    "total_events": 0,
    "enter_count": 0,
    "exit_count": 0,
    "current_people": 0  # 내부 인원
}
current_tracks = {}  # track_id별 현재 상태

TOPST_IP = os.getenv('TOPST_IP', 'localhost')
MQTT_PORT = int(os.getenv('MQTT_PORT', 1883))
MQTT_TOPIC = os.getenv('MQTT_TOPIC', 'highend/#')
SERVER_HOST = os.getenv('SERVER_HOST', '0.0.0.0')
SERVER_PORT = int(os.getenv('SERVER_PORT', 8000))

logger.info(f"설정: TOPST_IP={TOPST_IP}, MQTT_PORT={MQTT_PORT}")


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logger.info("success: TOPST connected")
        client.subscribe(MQTT_TOPIC)
    else:
        logger.error(f"failed conection: {rc}")

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode())
        logger.info(f"수신: {msg.topic}")
        
        # 데이터 파싱
        device = data.get("device", "unknown")
        ts = data.get("ts", 0)
        seq = data.get("seq", 0)
        payload = data.get("payload", {})
        
        event_type = payload.get("type")
        track_id = payload.get("track_id")
        
        # 타임스탬프 변환 (ms → ISO format)
        timestamp = datetime.fromtimestamp(ts / 1000).isoformat() if ts else datetime.now().isoformat()
        
        # 이벤트 처리
        if event_type == "enter":
            handle_enter(device, track_id, payload, timestamp, seq)
        elif event_type == "exit":
            handle_exit(device, track_id, payload, timestamp, seq)
        else:
            logger.warning(f"알 수 없는 타입: {event_type}")
            
    except Exception as e:
        logger.error(f"처리 오류: {e}")

def handle_enter(device, track_id, payload, timestamp, seq):
    """입장 이벤트 처리"""
    logger.info(f"🚶 입장: track_id={track_id}")
    
    # 이미지 데이터
    image_data = payload.get("image", {})
    
    # 이벤트 저장
    event = {
        "type": "enter",
        "device": device,
        "track_id": track_id,
        "timestamp": timestamp,
        "seq": seq,
        "image": image_data,
        "severity": "medium"
    }
    events.append(event)
    
    # 통계 업데이트
    stats["total_events"] += 1
    stats["enter_count"] += 1
    stats["current_people"] += 1
    
    # 현재 추적 중인 사람 저장
    current_tracks[track_id] = {
        "entered_at": timestamp,
        "status": "inside"
    }

def handle_exit(device, track_id, timestamp, seq):
    """퇴장 이벤트 처리"""
    logger.info(f"🚶‍♂️ 퇴장: track_id={track_id}")
    
    # 이벤트 저장
    event = {
        "type": "exit",
        "device": device,
        "track_id": track_id,
        "timestamp": timestamp,
        "seq": seq,
        "severity": "low"
    }
    events.append(event)
    
    # 통계 업데이트
    stats["total_events"] += 1
    stats["exit_count"] += 1
    if stats["current_people"] > 0:
        stats["current_people"] -= 1
    
    # 추적 제거
    if track_id in current_tracks:
        del current_tracks[track_id]

@app.on_event("startup")
async def startup():
    global mqtt_client
    mqtt_client = mqtt.Client("rpi_backend")
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    
    try:
        mqtt_client.connect(TOPST_IP, MQTT_PORT, 60)
        mqtt_client.loop_start()
        logger.info("🚀 서버 시작")
    except Exception as e:
        logger.error(f"❌ MQTT 연결 실패: {e}")

@app.on_event("shutdown")
async def shutdown():
    if mqtt_client:
        mqtt_client.loop_stop()
        mqtt_client.disconnect()
    logger.info("🛑 서버 종료")

# API 엔드포인트

@app.get("/")
async def root():
    return {
        "status": "running",
        "message": "방범 카메라 API"
    }

@app.get("/api/status")
async def get_status():
    """시스템 상태"""
    return {
        "mqtt_connected": mqtt_client.is_connected() if mqtt_client else False,
        "total_events": stats["total_events"],
        "current_people": stats["current_people"],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/events")
async def get_events(limit: int = 50):
    """최근 이벤트 목록"""
    event_list = list(reversed(list(events)))
    return event_list[:limit]

@app.get("/api/stats")
async def get_stats():
    """통계"""
    return stats

@app.get("/api/tracks")
async def get_current_tracks():
    """현재 추적 중인 사람들"""
    return {
        "count": len(current_tracks),
        "tracks": current_tracks
    }

@app.get("/api/image/{track_id}")
async def get_person_image(track_id: int):
    """특정 사람의 입장 이미지"""
    for event in reversed(events):
        if event.get("type") == "enter" and event.get("track_id") == track_id:
            return {
                "track_id": track_id,
                "image": event.get("image", {}),
                "timestamp": event.get("timestamp")
            }
    return {"error": "Image not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=SERVER_HOST, port=SERVER_PORT)