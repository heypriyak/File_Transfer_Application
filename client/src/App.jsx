
import React, { useRef, useState } from 'react';
import './App.css';

const API_URL = '/api/files';

function App() {
  // Transfer state
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [completedTransfers, setCompletedTransfers] = useState(0);
  const [pendingTransfers, setPendingTransfers] = useState(0);
  const [notificationPref, setNotificationPref] = useState('Enabled');
  const [languagePref, setLanguagePref] = useState('English');
  const fileInput = useRef();

  // Fetch file list
  React.useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setFiles)
      .catch(() => setError('Failed to fetch files'));
  }, [uploading, completedTransfers]);

  // Handle file upload with progress
  const handleUploadWithProgress = (file) => {
    setUploading(true);
    setError('');
    setProgress(0);
    setSelectedFile(file);
    setPendingTransfers(1);
    const formData = new FormData();
    formData.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded * 100) / e.total));
      }
    };
    xhr.onload = () => {
      setUploading(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
      setPendingTransfers(0);
      setCompletedTransfers((c) => c + 1);
      setSelectedFile(null);
      if (xhr.status !== 200) setError('Upload failed');
      else setError('');
    };
    xhr.onerror = () => {
      setUploading(false);
      setPendingTransfers(0);
      setError('Upload failed');
    };
    xhr.send(formData);
  };

  // Drag-and-drop
  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleUploadWithProgress(e.dataTransfer.files[0]);
    }
  };

  // File input change
  const onFileChange = (e) => {
    if (e.target.files.length) {
      handleUploadWithProgress(e.target.files[0]);
    }
  };

  // Pause/Resume/Cancel (UI only, not functional)
  const handlePause = () => alert('Pause not implemented');
  const handleResume = () => alert('Resume not implemented');
  const handleCancel = () => {
    setUploading(false);
    setProgress(0);
    setPendingTransfers(0);
    setSelectedFile(null);
  };

  // Transfer counts
  const ongoingTransfers = uploading ? 1 : 0;

  return (
    <div className="main-wrapper">
      <div className="center-content">
        <h1 className="title">File Transfer App</h1>
        <div className="card">
          <h2>Transfer Overview</h2>
          <div className="overview-row">
            <span>Ongoing Transfers: {ongoingTransfers}</span>
            <span>Completed Transfers: {completedTransfers}</span>
            <span>Pending Transfers: {pendingTransfers}</span>
          </div>
          <hr />
          <div className="upload-section">
            <input
              type="file"
              ref={fileInput}
              style={{ display: 'none' }}
              onChange={onFileChange}
              disabled={uploading}
            />
            <button className="choose-btn" onClick={() => fileInput.current.click()} disabled={uploading}>
              Choose Files
            </button>
            <span className="file-chosen">{selectedFile ? selectedFile.name : 'No file chosen'}</span>
            <div
              className="dropzone styled-dropzone"
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
              style={{ margin: '16px 0' }}
            >
              Drag and Drop files here or Browse
            </div>
            <div className="progress-label">{progress}%</div>
            <button className="upload-btn" onClick={() => selectedFile && handleUploadWithProgress(selectedFile)} disabled={!selectedFile || uploading}>
              Upload
            </button>
          </div>
          <div className="transfer-details">
            <h3>Transfer Details</h3>
            <div>File Name: {selectedFile ? selectedFile.name : '-'}</div>
            <div>File Size: {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB' : '-'}</div>
            <div>{progress}% - {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : '0'} MB of {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : '0'} MB transferred</div>
            <div className="transfer-btns">
              <button className="pause-btn" onClick={handlePause} disabled={!uploading}>Pause</button>
              <button className="resume-btn" onClick={handleResume} disabled={uploading || !selectedFile}>Resume</button>
              <button className="cancel-btn" onClick={handleCancel} disabled={!uploading}>Cancel</button>
            </div>
          </div>
        </div>
        <div className="card">
          <h3>User Settings</h3>
          <div className="settings-row">
            <label>Notification Preferences:</label>
            <select value={notificationPref} onChange={e => setNotificationPref(e.target.value)}>
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>
          <div className="settings-row">
            <label>Language Preference:</label>
            <select value={languagePref} onChange={e => setLanguagePref(e.target.value)}>
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>
        <div className="card">
          <h3>Shared Files</h3>
          <div className="file-list">
            {files.length === 0 && <div>No files uploaded yet.</div>}
            {files.map(file => (
              <div className="file-item" key={file._id}>
                <div className="file-meta">
                  <span className="file-name">{file.originalName}</span>
                  <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                  <span className="file-time">{new Date(file.uploadTime).toLocaleString()}</span>
                </div>
                <a
                  className="download-btn"
                  href={`/api/files/${file._id}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
                <button
                  className="download-btn"
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    const url = `${window.location.origin}/api/files/${file._id}/download`;
                    navigator.clipboard.writeText(url);
                    alert('Download link copied!');
                  }}
                >
                  Copy Link
                </button>
              </div>
            ))}
          </div>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default App;
