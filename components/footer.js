import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, CircularProgress } from '@mui/material';
import { Phone, Chat } from '@mui/icons-material';
import styles from '../CSS/chatbot.module.css'; // Assuming you have chatbot styles here

export default function Footer() {
  const [chatOpen, setChatOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleChat = () => {
    setChatOpen(!chatOpen);
    setPrompt('');
    setResponse('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error communicating with the chatbot:', error);
      setResponse('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='footer-con'>
      <h4>Copyright © 2024. All Rights Reserved.</h4>
      <div>
        <Button
          startIcon={<Phone />}
          size='large'
          sx={{
            color: 'var(--primary-color)',
          }}
        >
          Contact Us
        </Button>
        <Button
          startIcon={<Chat />}
          size='large'
          onClick={toggleChat}
          sx={{
            color: 'var(--primary-color)',
          }}
        >
          Chat with Us
        </Button>

        {/* Chatbot Modal */}
        <Dialog open={chatOpen} onClose={toggleChat} fullWidth maxWidth='sm'>
          <DialogTitle>Pet Adoption Assistant</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} className={styles.chatbotForm}>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your question here..."
                variant="outlined"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ marginTop: '1rem' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Ask'}
              </Button>
            </form>
            {response && (
              <div className={styles.response}>
                <strong>Assistant:</strong> {response}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
