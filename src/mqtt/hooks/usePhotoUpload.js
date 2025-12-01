import { useCallback } from 'react';
import { useMqttContext } from '../MqttContext';

export function usePhotoUpload() {
  const { client, isConnected } = useMqttContext();

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
        const arrayBuffer = e.target.result;
        const imageBuffer = new Uint8Array(arrayBuffer);

        client.publish("topst/rpi/photo", imageBuffer, (err) => {
          if (err) {
            console.error("[MqttPhotoUpload] Failed to publish photo:", err);
            reject(err);
          } else {
            console.log("Photo published successfully");
            resolve();
          }
        });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }, [client, isConnected]);

  return { uploadPhoto, isConnected };
}
