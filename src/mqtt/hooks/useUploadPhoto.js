import { useCallback, useRef } from 'react';
import { useMqttContext } from '../MqttContext';

const MAX_WIDTH = 640;
const MAX_HEIGHT = 480;

export function useUploadPhoto() {
  const { client, isConnected } = useMqttContext();
  const seqRef = useRef(0);

  const uploadPhoto = useCallback(async (file) => {
    if (!client || !isConnected) {
      const err = new Error("[MqttUploadPhoto] MQTT client not connected");
      console.error(err);
      throw err;
    }

    if (!file) {
      const err = new Error("[MqttUploadPhoto] No file selected");
      console.error(err);
      throw err;
    }

    // load img and get original dimensions
    const img = await new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };

      img.src = url;
    });

    let width = img.width;
    let height = img.height;

    // Resize if larger than 640x480
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
      const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    // draw to canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    // get format and base64 data
    const mimeType = file.type;
    const dataUrl = canvas.toDataURL(mimeType);

    const format = mimeType.split('/')[1];
    const base64Data = dataUrl.split(',')[1];

    // send message
    seqRef.current += 1;

    const message = {
      device: "raspberry-pi-4",
      ts: Date.now(),
      seq: seqRef.current,
      payload: {
        format: format,
        width: width,
        height: height,
        data: base64Data
      }
    };
    const jsonString = JSON.stringify(message);

    await client.publishAsync("topst/rpi/face", jsonString);
  }, [client, isConnected]);

  return { uploadPhoto, isConnected };
}
