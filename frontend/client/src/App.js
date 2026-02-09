import { useState, useRef, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FaGear } from "react-icons/fa6";
import { LiaTelegramPlane } from "react-icons/lia";
import { FaArrowAltCircleLeft, FaHistory } from "react-icons/fa";
import { IoIosCloudOutline } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import SearchHistorySidebar from "./searchHistorySideBar";

import "./App.css";

const gradeSubjects = {
  gradekg: [
    { value: "basic_writing", label: "á€¡á€›á€±á€¸ (á€¡á€á€¼á€±á€á€¶á€¡á€›á€±á€¸á€œá€±á€·á€€á€»á€„á€·á€ºá€á€”á€ºá€¸)" },
    { value: "writing_myanmar_alphabet", label: "á€¡á€›á€±á€¸ (á€™á€¼á€”á€ºá€™á€¬á€¡á€€á€¹á€á€›á€¬)" },
    { value: "writing_myanmar_numbers", label: "á€¡á€›á€±á€¸ (á€™á€¼á€”á€ºá€™á€¬á€€á€­á€”á€ºá€¸á€‚á€á€¬á€”á€ºá€¸)" },
    { value: "writing_english_alphabet", label: "á€¡á€›á€±á€¸ (á€¡á€„á€ºá€¹á€‚á€œá€­á€•á€ºá€¡á€€á€¹á€á€›á€¬)" },
    { value: "writing_english_numbers", label: "á€¡á€›á€±á€¸ (á€¡á€„á€ºá€¹á€‚á€œá€­á€•á€ºá€€á€­á€”á€ºá€¸á€‚á€á€¬á€”á€ºá€¸)" },
    { value: "reading_myanmar", label: "á€¡á€–á€á€º" },
    { value: "reading_english", label: "á€¡á€–á€á€º (á€¡á€„á€ºá€¹á€‚á€œá€­á€•á€º)" },
    { value: "speaking_myanmar", label: "á€¡á€•á€¼á€±á€¬ (á€™á€¼á€”á€ºá€™á€¬)" },
    { value: "science_animals", label: "á€žá€­á€•á€¹á€•á€¶ (á€á€­á€›á€…á€¹á€†á€¬á€”á€ºá€™á€»á€¬á€¸á€¡á€€á€¼á€±á€¬á€„á€ºá€¸)" },
    { value: "science_plants", label: "á€žá€­á€•á€¹á€•á€¶ (á€¡á€•á€„á€ºá€™á€»á€¬á€¸á€¡á€€á€¼á€±á€¬á€„á€ºá€¸)" },
    { value: "science_self_family_environment", label: "á€žá€­á€•á€¹á€•á€¶ (á€€á€»á€½á€”á€ºá€¯á€•á€ºáŠ á€€á€»á€½á€”á€ºá€¯á€•á€ºáá€™á€­á€žá€¬á€¸á€…á€¯ á€”á€¾á€„á€·á€º á€€á€»á€½á€”á€ºá€¯á€•á€ºáá€•á€á€ºá€á€”á€ºá€¸á€€á€»á€„á€ºá€¡á€€á€¼á€±á€¬á€„á€ºá€¸)" },
    { value: "science_earth_universe", label: "á€žá€­á€•á€¹á€•á€¶ (á€€á€»á€½á€”á€ºá€¯á€•á€ºá€á€­á€¯á€·á€€á€™á€¹á€˜á€¬á€™á€¼á€±á€€á€¼á€®á€¸áŠ á€€á€±á€¬á€„á€ºá€¸á€€á€„á€ºá€”á€¾á€„á€·á€º á€…á€€á€¼á€¬á€á€ á€¬á€¡á€€á€¼á€±á€¬á€„á€ºá€¸)" },
    { value: "arts_music", label: "á€¡á€á€¼á€±á€á€¶á€œá€€á€ºá€™á€¾á€¯á€”á€¾á€„á€·á€ºá€¡á€”á€¯á€•á€Šá€¬ (á€‚á€®á€)" },
    { value: "arts_painting", label: "á€¡á€á€¼á€±á€á€¶á€œá€€á€ºá€™á€¾á€¯á€”á€¾á€„á€·á€ºá€¡á€”á€¯á€•á€Šá€¬ (á€•á€”á€ºá€¸á€á€»á€®)" },
    { value: "arts_handicraft", label: "á€¡á€á€¼á€±á€á€¶á€œá€€á€ºá€™á€¾á€¯á€”á€¾á€„á€·á€ºá€¡á€”á€¯á€•á€Šá€¬ (á€œá€€á€ºá€™á€¾á€¯)" },
    { value: "health_personal", label: "á€€á€­á€¯á€šá€ºá€›á€±á€¸á€€á€­á€¯á€šá€ºá€á€¬á€…á€±á€¬á€„á€·á€ºá€›á€¾á€±á€¬á€€á€ºá€™á€¾á€¯á€”á€¾á€„á€·á€º á€€á€»á€”á€ºá€¸á€™á€¬á€›á€±á€¸ (á€€á€­á€¯á€šá€ºá€›á€±á€¸á€€á€­á€¯á€šá€ºá€á€¬á€…á€±á€¬á€„á€·á€ºá€›á€¾á€±á€¬á€€á€ºá€™á€¾á€¯)" },
    { value: "poetry_english", label: "á€€á€—á€»á€¬ (English)" },
    { value: "story_english_1", label: "á€•á€¯á€¶á€•á€¼á€„á€ºá€™á€»á€¬á€¸ (English)" },
    { value: "story_english_2", label: "á€•á€¯á€¶á€•á€¼á€„á€ºá€™á€»á€¬á€¸ (English)" }
  ],
  grade1: [
    { value: "myanmar", label: "á€™á€¼á€”á€ºá€™á€¬á€…á€¬" },
    { value: "english", label: "á€¡á€„á€ºá€¹á€‚á€œá€­á€•á€ºá€…á€¬" },
    { value: "math", label: "á€žá€„á€ºá€¹á€á€»á€¬" },
    { value: "science", label: "á€žá€­á€•á€¹á€•á€¶" },
    { value: "morality_and_civic", label: "á€…á€¬á€›á€­á€á€¹á€á€”á€¾á€„á€·á€ºá€•á€¼á€Šá€ºá€žá€°á€·á€”á€®á€á€­" },
    { value: "social_studies", label: "á€œá€°á€™á€¾á€¯á€›á€±á€¸" }
  ],
  grade2: [
    { value: "myanmar", label: "á€™á€¼á€”á€ºá€™á€¬á€…á€¬" },
    { value: "english", label: "á€¡á€„á€ºá€¹á€‚á€œá€­á€•á€ºá€…á€¬" },
    { value: "math", label: "á€žá€„á€ºá€¹á€á€»á€¬" },
    { value: "science", label: "á€žá€­á€•á€¹á€•á€¶" },
    { value: "morality_and_civic", label: "á€…á€¬á€›á€­á€á€¹á€á€”á€¾á€„á€·á€ºá€•á€¼á€Šá€ºá€žá€°á€·á€”á€®á€á€­" },
    { value: "social_studies", label: "á€œá€°á€™á€¾á€¯á€›á€±á€¸" }
  ],
  grade3: [
    { value: "myanmar", label: "á€™á€¼á€”á€ºá€™á€¬á€…á€¬" },
    { value: "english", label: "á€¡á€„á€ºá€¹á€‚á€œá€­á€•á€ºá€…á€¬" },
    { value: "math", label: "á€žá€„á€ºá€¹á€á€»á€¬" },
    { value: "science", label: "á€žá€­á€•á€¹á€•á€¶" },
    { value: "morality_and_civic", label: "á€…á€¬á€›á€­á€á€¹á€á€”á€¾á€„á€·á€ºá€•á€¼á€Šá€ºá€žá€°á€·á€”á€®á€á€­" },
    { value: "social_studies", label: "á€œá€°á€™á€¾á€¯á€›á€±á€¸" }
  ],
  grade4: [
    { value: "myanmar", label: "á€™á€¼á€”á€ºá€™á€¬á€…á€¬" },
    { value: "english", label: "á€¡á€„á€ºá€¹á€‚á€œá€­á€•á€ºá€…á€¬" },
    { value: "math", label: "á€žá€„á€ºá€¹á€á€»á€¬" },
    { value: "science", label: "á€žá€­á€•á€¹á€•á€¶" },
    { value: "geography_history", label: "á€•á€‘á€á€®á€á€„á€ºá€”á€¾á€„á€·á€ºá€žá€™á€­á€¯á€„á€ºá€¸" },
    { value: "visual_art", label: "Visual Art" },
    { value: "morality_and_civic", label: "á€…á€¬á€›á€­á€á€¹á€á€”á€¾á€„á€·á€ºá€•á€¼á€Šá€ºá€žá€°á€·á€”á€®á€á€­" },
    { value: "life_skills", label: "Life Skills" },
    { value: "performing_arts", label: "Performing Arts" },
    { value: "physical_education", label: "Physical Education" },
    { value: "social_studies", label: "á€œá€°á€™á€¾á€¯á€›á€±á€¸" }
  ],
  grade5: [
    { value: "myanmar", label: "á€™á€¼á€”á€ºá€™á€¬á€…á€¬" },
    { value: "english", label: "á€¡á€„á€ºá€¹á€‚á€œá€­á€•á€ºá€…á€¬" },
    { value: "math", label: "á€žá€„á€ºá€¹á€á€»á€¬" },
    { value: "science", label: "á€žá€­á€•á€¹á€•á€¶" },
    { value: "geography_history", label: "á€•á€‘á€á€®á€á€„á€ºá€”á€¾á€„á€·á€ºá€žá€™á€­á€¯á€„á€ºá€¸" },
    { value: "visual_art", label: "Visual Art" },
    { value: "morality_and_civic", label: "á€…á€¬á€›á€­á€á€¹á€á€”á€¾á€„á€·á€ºá€•á€¼á€Šá€ºá€žá€°á€·á€”á€®á€á€­" },
    { value: "life_skills", label: "Life Skills" },
    { value: "performing_arts", label: "Performing Arts" },
    { value: "physical_education", label: "Physical Education" },
    { value: "social_studies", label: "á€œá€°á€™á€¾á€¯á€›á€±á€¸" }
  ],
  grade6: [
    { value: "myanmar", label: "á€™á€¼á€”á€ºá€™á€¬á€…á€¬" },
    { value: "english", label: "á€¡á€„á€ºá€¹á€‚á€œá€­á€•á€ºá€…á€¬" },
    { value: "math_one", label: "á€žá€„á€ºá€¹á€á€»á€¬(á)" },
    { value: "math_two", label: "á€žá€„á€ºá€¹á€á€»á€¬(á‚)" },
    { value: "science", label: "á€žá€­á€•á€¹á€•á€¶" },
    { value: "geography", label: "á€•á€‘á€á€®á€á€„á€º" },
    { value: "history", label: "á€žá€™á€­á€¯á€„á€ºá€¸" },
    { value: "morality_and_civic", label: "á€…á€¬á€›á€­á€á€¹á€á€”á€¾á€„á€·á€ºá€•á€¼á€Šá€ºá€žá€°á€·á€”á€®á€á€­" }
  ],
  grade7: [],
  grade8: [],
  grade9: [],
  grade10: [],
  grade11: [],
  grade12: []
};

function App() {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [started, setStarted] = useState(false);
  const [showSelector, setShowSelector] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [intercomOpen, setIntercomOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const canStart = grade && subject;
  const canChat = started && !showSelector;

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  // Generate userId for local chat storage
  const userId = useRef(
    localStorage.getItem("userId") || crypto.randomUUID()
  );
  useEffect(() => {
    localStorage.setItem("userId", userId.current);
  }, []);

  /* =======================
     Send message
  ======================= */
  const sendMessage = async () => {
    if (!input.trim() || !canChat) return;

    const userMessage = input;
    const timestamp = new Date().toISOString();

    setMessages(prev => [
      ...prev,
      { role: "user", text: userMessage, time: timestamp }
    ]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, subject, message: userMessage, userId: userId.current })
      });
      const data = await res.json();

      setMessages(prev => {
        // mark new message if chat is closed
        if (!intercomOpen) setHasNewMessage(true);

        return [
          ...prev,
          { role: "ai", text: data.reply.text, videos: data.reply.videos || [], time: new Date().toISOString() }
        ];
      });

      // save history
      fetch(`${API_BASE}/api/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          subject,
          userId: userId.current,
          messages: [
            ...messages,
            { role: "user", text: userMessage, createdAt: new Date() },
            { role: "ai", text: data.reply.text, videos: data.reply.videos || [], createdAt: new Date() }
          ]
        })
      }).catch(err => console.error("Failed to save chat history", err));

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "âŒ Server error", time: new Date().toISOString() }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /* =======================
     Effects
  ======================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  /* Reset new message badge when chat opens */
  useEffect(() => {
    if (intercomOpen) setHasNewMessage(false);
  }, [intercomOpen]);

  return (
    <>
      {/* Floating Intercom Button */}
      <div
        className="intercom-btn"
        onClick={() => setIntercomOpen(prev => !prev)}
      >
        {intercomOpen ? <RxCross2 /> : <IoIosCloudOutline />}
        {!intercomOpen && hasNewMessage && <span className="new-msg-badge" />}
      </div>

      {/* Chat Window */}
      <div className="intercom-wrapper" style={{ display: intercomOpen ? "block" : "none" }}>
        <div className="chat-container">
          <div className="chat-container">
            <h2>á€žá€¯á€á€™á€­á€”á€ºá€€á€¼á€®á€¸</h2>

            {/* Reselect button */}
            {started && !showSelector && (
              <button
                className="reselect-btn"
                onClick={() => setShowSelector(true)}
                title="Change Grade / Subject"
              >
                <FaGear />
              </button>
            )}

            {/* History button */}
            <button
              className="history-btn"
              onClick={() => setShowHistory(prev => !prev)}
              title="Search History"
            >
              <FaHistory />
            </button>

            {showHistory && (
              <SearchHistorySidebar
                messages={messages}
                onSelect={query => {
                  setInput(query.text);
                  setShowHistory(false);
                }}
              />
            )}

            {/* Selector panel */}
            {showSelector && (
              <div className="select-box">
                <select
                  value={grade}
                  onChange={e => { setGrade(e.target.value); setSubject(""); }}
                >
                  <option value="">Select Grade</option>
                  <option value="gradekg">Kindergarten</option>
                  <option value="grade1"> Grade 1</option>
                  <option value="grade2">Grade 2</option>
                  <option value="grade3">Grade 3</option>
                  <option value="grade4">Grade 4</option>
                  <option value="grade5">Grade 5</option>
                </select>

                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  disabled={!grade}
                >
                  <option value="">Select Subject</option>
                  {grade && gradeSubjects[grade].map(sub => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>

                <button
                  className="start-btn"
                  disabled={!canStart}
                  onClick={() => { setStarted(true); setShowSelector(false); setMessages([]); }}
                >
                  <FaArrowAltCircleLeft className="hover-icon" />
                </button>
              </div>
            )}

            {/* Chat Area */}
            <div className="chat-box">
              {!started && <div className="system-msg">ðŸ“˜ Grade á€”á€¾á€„á€·á€º Subject á€€á€­á€¯ á€›á€½á€±á€¸á€•á€¼á€®á€¸ Start á€€á€­á€¯á€”á€¾á€­á€•á€ºá€•á€«</div>}

              {messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  <p>{m.text}</p>
                  <small>{new Date(m.time).toLocaleTimeString()}</small>

                  {m.videos && m.videos.length > 0 && m.videos.map(video => (
                    <div key={video.video_id} className="video-link">
                      <a href={video.embed_url} target="_blank" rel="noreferrer">ðŸŽ¬ {video.title_en}</a>
                    </div>
                  ))}
                </div>
              ))}

              {isTyping && <div className="message ai"><ThreeDots height="20" width="30" color="#32cd32" /></div>}

              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
              <textarea
                ref={textareaRef}
                value={input}
                disabled={!canChat}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={canChat ? "Ask about lessons..." : "Select grade & subject first"}
                className="chat-input"
                rows={1}
              />
              <button
                className="send-btn"
                onClick={sendMessage}
                disabled={!input.trim() || !canChat || isTyping}
              >
                <LiaTelegramPlane />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

