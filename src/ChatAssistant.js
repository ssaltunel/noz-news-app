import React, { useState } from 'react';

export default function ChatAssistant({ selectedNews }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hallo! Möchtest du, dass ich diesen Artikel zusammenfasse?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          newsTitle: selectedNews?.title || '',
          newsContent: selectedNews?.content || ''
        })
      });

      const data = await res.json();

      const aiReply = {
        role: 'assistant',
        text: data.reply || 'Keine Antwort von der KI.'
      };

      setMessages([...updatedMessages, aiReply]);
    } catch {
      setMessages([...updatedMessages, {
        role: 'assistant',
        text: 'Es gab ein Problem bei der Kommunikation mit der KI.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t mt-4 pt-4">
      <h2 className="text-lg font-semibold mb-2">KI-Assistent</h2>
      <div className="bg-gray-100 p-4 rounded h-64 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded ${msg.role === 'user' ? 'bg-blue-200' : 'bg-gray-300'}`}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <p className="text-gray-500">KI denkt...</p>}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border p-2 rounded-l"
          placeholder="Schreibe etwas..."
          onKeyDown={e => {
            if (e.key === 'Enter' && !loading) {
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded-r"
          disabled={loading}
        >
          Senden
        </button>
      </div>
    </div>
  );
}
