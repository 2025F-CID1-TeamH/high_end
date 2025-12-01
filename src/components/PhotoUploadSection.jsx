import React, { useState } from 'react';
import { usePhotoUpload } from '../mqtt/hooks/usePhotoUpload';
import '../styles/PhotoUploadSection.css';

export default function PhotoUploadSection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const { uploadPhoto, isConnected } = usePhotoUpload();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadComplete(false);
      setUploadError(false);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);
      setUploadComplete(false);
      setUploadError(false);

      try {
        await uploadPhoto(selectedFile);
        setUploadComplete(true);
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadError(true);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="photo-upload-section">
      <h2>📸 얼굴 사진 업로드</h2>
      <div className="upload-controls">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="photo-upload-input"
          className="file-input"
          disabled={isUploading}
        />
        <button
          onClick={handleUpload}
          disabled={!isConnected || !selectedFile || isUploading}
          className="upload-button"
        >
          {isUploading ? '전송중...' : (isConnected ? '전송' : '연결 중...')}
        </button>
      </div>
      {uploadComplete ? (
        <div className="preview-container">
          <p style={{ color: 'green', fontWeight: 'bold' }}>전송이 완료되었습니다.</p>
        </div>
      ) : uploadError ? (
        <div className="preview-container">
          <p style={{ color: 'red', fontWeight: 'bold' }}>전송에 실패했습니다. 다시 시도해주세요.</p>
        </div>
      ) : selectedFile && (
        <div className="preview-container">
          <p>선택된 파일: {selectedFile.name}</p>
        </div>
      )}
    </div>
  );
};
