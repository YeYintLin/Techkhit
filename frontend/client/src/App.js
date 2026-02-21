import { useState, useRef, useEffect, useCallback } from "react";
import { FaGear } from "react-icons/fa6";
import { LiaTelegramPlane } from "react-icons/lia";
import { FaArrowAltCircleLeft, FaHistory } from "react-icons/fa";
import { IoIosCloudOutline } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import SearchHistorySidebar from "./searchHistorySideBar";

import "./App.css";

const gradeSubjects = {
  gradekg: [
    { value: "basic_writing", label: "basic_writing" },
    { value: "writing_myanmar_alphabet", label: "writing_myanmar_alphabet" },
    { value: "writing_myanmar_numbers", label: "writing_myanmar_numbers" },
    { value: "writing_english_alphabet", label: "writing_english_alphabet" },
    { value: "writing_english_numbers", label: "writing_english_numbers" },
    { value: "reading_myanmar", label: "reading_myanmar" },
    { value: "reading_english", label: "reading_english" },
    { value: "speaking_myanmar", label: "speaking_myanmar" },
    { value: "science_animals", label: "science_animals" },
    { value: "science_plants", label: "science_plants" },
    { value: "science_self_family_environment", label: "science_self_family_environment" },
    { value: "science_earth_universe", label: "science_earth_universe" },
    { value: "arts_music", label: "arts_music" },
    { value: "arts_painting", label: "arts_painting" },
    { value: "arts_handicraft", label: "arts_handicraft" },
    { value: "health_personal", label: "health_personal" },
    { value: "poetry_english", label: "poetry_english" },
    { value: "story_english_1", label: "story_english_1" },
    { value: "story_english_2", label: "story_english_2" }
  ],
  grade1: [
    { value: "myanmar", label: "myanmar" },
    { value: "english", label: "english" },
    { value: "math", label: "math" },
    { value: "science", label: "science" },
    { value: "morality_and_civic", label: "morality_and_civic" },
    { value: "social_studies", label: "social_studies" }
  ],
  grade2: [
    { value: "myanmar", label: "myanmar" },
    { value: "english", label: "english" },
    { value: "math", label: "math" },
    { value: "science", label: "science" },
    { value: "morality_and_civic", label: "morality_and_civic" },
    { value: "social_studies", label: "social_studies" }
  ],
  grade3: [
    { value: "myanmar", label: "myanmar" },
    { value: "english", label: "english" },
    { value: "math", label: "math" },
    { value: "science", label: "science" },
    { value: "morality_and_civic", label: "morality_and_civic" },
    { value: "social_studies", label: "social_studies" }
  ],
  grade4: [
    { value: "myanmar", label: "myanmar" },
    { value: "english", label: "english" },
    { value: "math", label: "math" },
    { value: "science", label: "science" },
    { value: "geography_history", label: "geography_history" },
    { value: "visual_art", label: "visual_art" },
    { value: "morality_and_civic", label: "morality_and_civic" },
    { value: "life_skills", label: "life_skills" },
    { value: "performing_arts", label: "performing_arts" },
    { value: "physical_education", label: "physical_education" },
    { value: "social_studies", label: "social_studies" }
  ],
  grade5: [
    { value: "myanmar", label: "myanmar" },
    { value: "english", label: "english" },
    { value: "math", label: "math" },
    { value: "science", label: "science" },
    { value: "geography_history", label: "geography_history" },
    { value: "visual_art", label: "visual_art" },
    { value: "morality_and_civic", label: "morality_and_civic" },
    { value: "life_skills", label: "life_skills" },
    { value: "performing_arts", label: "performing_arts" },
    { value: "physical_education", label: "physical_education" },
    { value: "social_studies", label: "social_studies" }
  ],
  grade6: [
    { value: "myanmar", label: "myanmar" },
    { value: "english", label: "english" },
    { value: "math_one", label: "math_one" },
    { value: "math_two", label: "math_two" },
    { value: "science", label: "science" },
    { value: "geography", label: "geography" },
    { value: "history", label: "history" },
    { value: "morality_and_civic", label: "morality_and_civic" }
  ],
  grade7: [],
  grade8: [],
  grade9: [],
  grade10: [],
  grade11: [],
  grade12: []
};


function App({ widgetConfig = {} }) {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [started, setStarted] = useState(false);
  const [showSelector, setShowSelector] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [intercomOpen, setIntercomOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [knowledgeGrade, setKnowledgeGrade] = useState("");
  const [knowledgeSubject, setKnowledgeSubject] = useState("");
  const [knowledgeChapter, setKnowledgeChapter] = useState("");
  const [knowledgeText, setKnowledgeText] = useState("");
  const [knowledgeFile, setKnowledgeFile] = useState(null);
  const [knowledgeItems, setKnowledgeItems] = useState([]);
  const [knowledgeSaving, setKnowledgeSaving] = useState(false);
  const [knowledgeError, setKnowledgeError] = useState("");
  const [knowledgeEditingId, setKnowledgeEditingId] = useState("");

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const canStart = grade && subject;
  const canChat = started && !showSelector;

  const API_BASE =
    process.env.REACT_APP_API_BASE ||
    (window.location.hostname === "localhost" && window.location.port === "3000"
      ? "http://localhost:5000"
      : "");

  const defaultButtonStyle = {
    position: "fixed",
    bottom: 20,
    right: 20
  };
  const defaultPanelStyle = {
    position: "fixed",
    bottom: 90,
    right: 20
  };
  const buttonStyle = { ...defaultButtonStyle, ...(widgetConfig.buttonStyle || {}) };
  const panelStyle = { ...defaultPanelStyle, ...(widgetConfig.panelStyle || {}) };

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
    const userEntry = { role: "user", text: userMessage, time: timestamp };
    const baseMessages = [...messages, userEntry];

    setMessages(baseMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, subject, message: userMessage, userId: userId.current })
      });

      const responseText = await res.text();
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (error) {
        throw new Error("Chat API returned invalid JSON");
      }

      if (!res.ok || !data?.reply) {
        const errorMessage = data?.error || data?.message || "Chat API error";
        throw new Error(errorMessage);
      }

      const aiEntry = {
        role: "ai",
        text: data.reply.text || "AI did not send a reply.",
        videos: data.reply.videos || [],
        time: new Date().toISOString()
      };
      const updatedMessages = [...baseMessages, aiEntry];

      setMessages(prev => {
        // mark new message if chat is closed
        if (!intercomOpen) setHasNewMessage(true);

        return updatedMessages;
      });

      // save history
      fetch(`${API_BASE}/api/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          subject,
          userId: userId.current,
          messages: updatedMessages.map(m => ({
            role: m.role,
            text: m.text,
            videos: m.videos || [],
            createdAt: new Date(m.time || Date.now())
          }))
        })
      }).catch(err => console.error("Failed to save chat history", err));

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "? Server error", time: new Date().toISOString() }
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

  const loadKnowledge = useCallback(async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.grade) params.set("grade", filters.grade);
      if (filters.subject) params.set("subject", filters.subject);
      if (filters.chapter) params.set("chapter", filters.chapter);
      const qs = params.toString();
      const res = await fetch(`${API_BASE}/api/knowledge${qs ? `?${qs}` : ""}`);
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Knowledge API returned non-JSON:", text);
        return;
      }
      if (!res.ok) {
        console.error("Knowledge API error:", data?.error || text);
        return;
      }
      setKnowledgeItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error("Failed to load knowledge", err);
    }
  }, [API_BASE]);

  useEffect(() => {
    if (!showKnowledgeModal) return;
    loadKnowledge({
      grade: knowledgeGrade,
      subject: knowledgeSubject,
      chapter: knowledgeChapter
    });
  }, [showKnowledgeModal, knowledgeGrade, knowledgeSubject, knowledgeChapter, loadKnowledge]);

  const handleKnowledgeSubmit = async () => {
    if (!knowledgeGrade || !knowledgeSubject) {
      setKnowledgeError("Please select grade and subject.");
      return;
    }

    if (!knowledgeText.trim() && !knowledgeFile) {
      setKnowledgeError("Please provide text or a PDF.");
      return;
    }

    setKnowledgeSaving(true);
    setKnowledgeError("");

    try {
      const formData = new FormData();
      formData.append("grade", knowledgeGrade);
      formData.append("subject", knowledgeSubject);
      if (knowledgeText.trim()) formData.append("text", knowledgeText.trim());
      if (knowledgeChapter.trim()) formData.append("chapter", knowledgeChapter.trim());
      if (knowledgeFile) formData.append("file", knowledgeFile);

      const isEdit = Boolean(knowledgeEditingId);
      const res = await fetch(`${API_BASE}/api/knowledge${isEdit ? `/${knowledgeEditingId}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        body: formData
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setKnowledgeError("Upload failed (server returned non-JSON)");
        return;
      }
      if (!res.ok) {
        setKnowledgeError(data?.error || "Upload failed");
      } else {
        setKnowledgeText("");
        setKnowledgeChapter("");
        setKnowledgeFile(null);
        setKnowledgeGrade("");
        setKnowledgeSubject("");
        setKnowledgeEditingId("");
        await loadKnowledge();
      }
    } catch (err) {
      setKnowledgeError("Upload failed");
    } finally {
      setKnowledgeSaving(false);
    }
  };

  const startEditKnowledge = item => {
    setKnowledgeEditingId(item._id || item.id || "");
    setKnowledgeGrade(item.grade || "");
    setKnowledgeSubject(item.subject || "");
    setKnowledgeChapter(item.chapter || "");
    setKnowledgeText(item.text || "");
    setKnowledgeFile(null);
    setKnowledgeError("");
  };

  const cancelEditKnowledge = () => {
    setKnowledgeEditingId("");
    setKnowledgeGrade("");
    setKnowledgeSubject("");
    setKnowledgeChapter("");
    setKnowledgeText("");
    setKnowledgeFile(null);
    setKnowledgeError("");
  };

  const deleteKnowledge = async id => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/api/knowledge/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Delete failed:", text);
        return;
      }
      await loadKnowledge({
        grade: knowledgeGrade,
        subject: knowledgeSubject,
        chapter: knowledgeChapter
      });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <>
      {/* Floating Intercom Button */}
      <div
        className="intercom-btn"
        onClick={() => setIntercomOpen(prev => !prev)}
        style={buttonStyle}
      >
        {intercomOpen ? <RxCross2 /> : <IoIosCloudOutline />}
        {!intercomOpen && hasNewMessage && <span className="new-msg-badge" />}
      </div>

      {/* Chat Window */}
      <div className="intercom-wrapper" style={{ display: intercomOpen ? "block" : "none", ...panelStyle }}>
        <div className="chat-container">
          <div className="chat-container">
            <h2>သုခမိန်ကြီး</h2>

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

            {/* Knowledge button */}
            <button
              className="knowledge-btn"
              onClick={() => { setShowKnowledgeModal(true); }}
              title="Knowledge"
            >
              K
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
              {!started && <div className="system-msg">Select Grade & Subject to Start</div>}

              {messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  <p>{m.text}</p>
                  <small>{new Date(m.time).toLocaleTimeString()}</small>

                  {m.videos && m.videos.length > 0 && m.videos.map(video => (
                    <div key={video.video_id} className="video-link">
                      <a href={video.embed_url} target="_blank" rel="noreferrer">?? {video.title_en}</a>
                    </div>

                  ))}
                </div>
              ))}

              {isTyping && (
                <div className="message ai">
                  <div className="typing-spinner" aria-live="polite">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

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

      {/* Knowledge Modal */}
      {showKnowledgeModal && (
        <div className="knowledge-modal-overlay" onClick={() => setShowKnowledgeModal(false)}>
          <div className="knowledge-modal" onClick={e => e.stopPropagation()}>
            <div className="knowledge-modal-header">
              <div>Knowledge Center (Demo)</div>
              <button
                className="knowledge-close-btn"
                onClick={() => setShowKnowledgeModal(false)}
              >
                <RxCross2 />
              </button>
            </div>

            <div className="knowledge-form">
              <div className="knowledge-field">
                <label>Grade</label>
                <select
                  value={knowledgeGrade}
                  onChange={e => { setKnowledgeGrade(e.target.value); setKnowledgeSubject(""); }}
                >
                  <option value="">Select Grade</option>
                  <option value="gradekg">Kindergarten</option>
                  <option value="grade1">Grade 1</option>
                  <option value="grade2">Grade 2</option>
                  <option value="grade3">Grade 3</option>
                  <option value="grade4">Grade 4</option>
                  <option value="grade5">Grade 5</option>
                </select>
              </div>

              <div className="knowledge-field">
                <label>Subject</label>
                <select
                  value={knowledgeSubject}
                  onChange={e => setKnowledgeSubject(e.target.value)}
                  disabled={!knowledgeGrade}
                >
                  <option value="">Select Subject</option>
                  {knowledgeGrade && gradeSubjects[knowledgeGrade].map(sub => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
              </div>

              <div className="knowledge-field">
                <label>Chapter</label>
                <input
                  type="text"
                  value={knowledgeChapter}
                  onChange={e => setKnowledgeChapter(e.target.value)}
                  placeholder="e.g., 1 or lesson title"
                />
              </div>

              <div className="knowledge-field">
                <label>Notes</label>
                <textarea
                  value={knowledgeText}
                  onChange={e => setKnowledgeText(e.target.value)}
                  placeholder="Paste or type lesson notes..."
                  rows={4}
                />
              </div>

              <div className="knowledge-field">
                <label>Attach File</label>
                <input
                  type="file"
                  accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={e => setKnowledgeFile(e.target.files?.[0] || null)}
                />
                <div className="knowledge-hint">PDF or DOCX, max 25MB.</div>
              </div>

              {knowledgeError && <div className="knowledge-error">{knowledgeError}</div>}

              <button
                className="knowledge-submit-btn"
                onClick={handleKnowledgeSubmit}
                disabled={knowledgeSaving}
              >
                {knowledgeSaving
                  ? "Saving..."
                  : knowledgeEditingId
                    ? "Save Changes"
                    : "Add Knowledge"}
              </button>
              {knowledgeEditingId && (
                <button
                  className="knowledge-cancel-btn"
                  onClick={cancelEditKnowledge}
                  disabled={knowledgeSaving}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="knowledge-list">
              <div className="knowledge-list-title">Uploaded Items</div>
              {knowledgeItems.length === 0 && <div className="knowledge-empty">No items yet</div>}
              {knowledgeItems.map(item => (
                <div className="knowledge-item" key={item._id || item.id}>
                  <div className="knowledge-item-title">{item.grade} / {item.subject}</div>
                  {item.chapter && <div className="knowledge-item-chapter">Chapter: {item.chapter}</div>}
                  {item.text && <div className="knowledge-item-text">Text: {item.text.slice(0, 120)}{item.text.length > 120 ? "..." : ""}</div>}
                  {item.fileName && <div className="knowledge-item-file">PDF: {item.fileName}</div>}
                  <div className="knowledge-item-actions">
                    <button onClick={() => startEditKnowledge(item)}>Edit</button>
                    <button onClick={() => deleteKnowledge(item._id || item.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
