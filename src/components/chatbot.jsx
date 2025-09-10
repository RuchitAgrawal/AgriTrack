"use client";
import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AgriTrack assistant. How can I help you with your agricultural supply chain today?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { text: input, isUser: true }]);
    const userMessage = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAKo1mmyUUcoeY9sP_fXDFFxz0wthsrJu8`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }],
          }),
        }
      );

      const data = await response.json();

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setMessages((msgs) => [
          ...msgs,
          { text: data.candidates[0].content.parts[0].text, isUser: false },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { text: "Sorry, I couldn't process your request.", isUser: false },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((msgs) => [
        ...msgs,
        { text: "An error occurred. Please try again.", isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full h-full rounded-lg flex flex-col shadow-xl border border-gray-200 dark:border-gray-700">
  {/* Header */}
  <div className="bg-primary-600 dark:bg-primary-500 p-2 rounded-t-lg text-center font-bold">
    AgriTrack Assistant
  </div>

  {/* Messages */}
  <div className="flex-1 p-2 overflow-y-auto space-y-2">
    {messages.map((msg, i) => (
      <div
        key={i}
        className={`p-2 rounded-xl max-w-[70%] ${
          msg.isUser
            ? "ml-auto bg-gray-100 dark:bg-gray-800 border border-primary-500 text-gray-900 dark:text-gray-100"
            : "mr-auto bg-primary-50 dark:bg-gray-700 border border-primary-300 dark:border-primary-500 text-gray-900 dark:text-gray-100"
        }`}
      >
        {msg.text}
      </div>
    ))}
    {loading && (
      <div className="italic text-primary-500 dark:text-primary-400 text-sm">
        Assistant is typing…
      </div>
    )}
  </div>

  {/* Input */}
  <div className="flex p-2 border-t border-gray-200 dark:border-gray-600">
    <input
      type="text"
      className="flex-1 p-1 rounded-lg bg-white dark:bg-gray-800 border border-primary-300 dark:border-primary-500 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500"
      placeholder="Ask about agriculture, supply chain..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    />
    <button
      onClick={sendMessage}
      className="ml-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-3 rounded-lg text-sm transition-colors"
    >
      Send
    </button>
  </div>
</div>

  );
}
