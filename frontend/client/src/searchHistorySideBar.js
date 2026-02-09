import React from "react";

export default function SearchHistorySidebar({ messages, onSelect }) {
  // Filter only user queries from the messages
  const history = messages
    .filter(m => m.role === "user")
    .map(m => m.text)
    .reverse(); // show latest search on top

  return (
    <div className="history-sidebar">
      <h3>🕒 Search History</h3>
      <ul>
        {history.length === 0 && <li>No history yet</li>}
        {history.map((query, idx) => (
          <li
            key={idx}
            onClick={() => onSelect(query)}
            title={query} // tooltip on hover
          >
            {query}
          </li>
        ))}
      </ul>
    </div>
  );
}
