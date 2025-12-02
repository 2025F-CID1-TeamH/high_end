import { useCallback, useRef } from 'react';
import { useMqttContext } from '../MqttContext';

export function usePhotoUpload() {
  const { client, isConnected } = useMqttContext();
  const seqRef = useRef(0);

  const uploadPhoto = useCallback((file) => {
    return new Promise((resolve, reject) => {
      if (!client || !isConnected) {
        const err = new Error("[MqttPhotoUpload] MQTT client not connected");
        console.error(err);
        reject(err);
        return;
      }

      if (!file) {
        const err = new Error("[MqttPhotoUpload] No file selected");
        console.error(err);
        reject(err);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const img = new Image();

        img.onload = () => {
          const width = img.width;
          const height = img.height;

          // Extract format and base64 data
          const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);

          if (!matches) {
            reject(new Error("Invalid image format"));
            return;
          }

          const format = matches[1];
          const base64Data = matches[2];

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

          client.publish("topst/rpi/face", jsonString, (err) => {
            if (err) {
              console.error("[MqttPhotoUpload] Failed to publish photo:", err);
              reject(err);
            } else {
              console.log("Photo published successfully");
              resolve();
            }
          });
        };

        img.onerror = (err) => {
          console.error("[MqttPhotoUpload] Failed to load image for dimensions:", err);
          reject(err);
        };

        img.src = dataUrl;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }, [client, isConnected]);

  return { uploadPhoto, isConnected };
}
