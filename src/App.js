import React, { useState, useEffect } from 'react';
import ChatAssistant from './ChatAssistant';

function App() {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/rss')
      .then(res => res.json())
      .then(data => {
        setNews(data.items.map(item => ({
          title: item.title,
          content: item.contentSnippet || item.content || '',
          image: item.enclosure?.url || null
        })));
      })
      .catch(() => setNews([]));
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar - News List */}
      <aside className="w-1/3 overflow-auto border-r border-gray-300 p-4">
        {news.map((item, index) => (
          <div
            key={index}
            className="mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={() => setSelectedNews(item)}
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>
            {item.image && (
              <img
                src={item.image}
                alt=""
                className="mt-2 w-full object-cover max-h-24 rounded"
              />
            )}
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {selectedNews ? (
          <>
            <h1 className="text-2xl font-bold mb-4">{selectedNews.title}</h1>
            {selectedNews.image && (
              <img
                src={selectedNews.image}
                alt=""
                className="max-w-full mb-4 rounded"
              />
            )}
            <p>{selectedNews.content}</p>

            {/* Chat Assistant under the article */}
            <div className="mt-8">
              <ChatAssistant selectedNews={selectedNews} />
            </div>
          </>
        ) : (
          <p>Haber seçiniz</p>
        )}
      </main>
    </div>
  );
}

export default App;
