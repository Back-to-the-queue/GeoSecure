import React, { useEffect, useState } from 'react';

const Messages: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch the message from the server
  const fetchMessage = async () => {
    setLoading(true);
    setError(null); // Reset error state before each fetch

    try {
      const response = await fetch('http://localhost:3000/message'); // Adjust the URL if needed
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch message when component mounts
  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Message from Server</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && <p>{message}</p>}

      <button onClick={fetchMessage} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
        Refresh Message
      </button>
    </div>
  );
};

export default Messages;
