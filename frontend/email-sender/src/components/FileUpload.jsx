

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUpload = ({ userId }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setStatus('File uploaded successfully!');
        navigate('/create-mail', { state: { csvData: response.data.data } });
      } else {
        setStatus('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error.response?.data?.message || 'File upload failed!';
      setStatus(errorMessage);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Upload a File</h2>
      <input
        type="file"
        onChange={handleFileChange}
        style={{
          display: 'block',
          margin: '0 auto 10px auto',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          width: '100%',
        }}
      />
      <p style={{ fontSize: '14px', color: '#555', margin: '10px 0' }}>
        Please upload a CSV file containing a column named <strong>Email</strong>.
      </p>
      <button
        onClick={handleUpload}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Upload
      </button>
      {status && (
        <p
          style={{
            marginTop: '10px',
            color: status.includes('success') ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
