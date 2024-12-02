import { useState } from 'react';
import styles from '../CSS/chatbot.module.css';

export default function Chatbot() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST', // Use POST for chatbot
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error communicating with the chatbot:", error);
      setResponse("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      <h1>Pet Adoption Assistant</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your question here..."
          required
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Loading..." : "Ask"}
        </button>
      </form>
      {response && <div className={styles.response}><strong>Assistant:</strong> {response}</div>}
    </div>
  );
}
