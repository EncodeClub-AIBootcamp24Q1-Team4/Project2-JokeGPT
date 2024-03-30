"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { useState } from 'react';

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
  } = useChat({
    body: {
      temperature: 0.5,
    },
  });

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [jokeType,  setJokeType]  = useState('pun');
  const [jokeTopic, setJokeTopic] = useState('work');
  const [jokeTone,  setJokeTone]  = useState('witty');
  const [temperature, setTemperature] = useState(0.5);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch">
      <div className="overflow-auto mb-8 w-full h-[67vh]" ref={messagesContainerRef}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-green-700 p-3 m-2 rounded-lg"
                : "bg-yellow-700 p-3 m-2 rounded-lg"
            }`}
          >
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-end pr-4">
            <span className="animate-bounce">...</span>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 w-full max-w-md">
        <div className="flex flex-col justify-center mb-2 items-center">
          <div className="flex mb-2">
            <label className="text-black font-bold mr-2">Topic: </label>
            <select 
              className="mb-2 bg-white rounded border shadow-inner w-64"
              disabled={isLoading}
              onChange={(e) => setJokeTopic(e.target.value)}
              >
              <option value="work">Work</option>
              <option value="people">People</option>
              <option value="animals">Animals</option>
              <option value="food">Food</option>
              <option value="television">Television</option>
            </select>
          </div>
          <div className="flex mb-2">
            <label className="text-black font-bold mr-2">Tone: </label>
            <select 
              className="mb-2 bg-white rounded border shadow-inner w-64"
              disabled={isLoading}
              onChange={(e) => setJokeTone(e.target.value)}
              >
              <option value="witty">Witty</option>
              <option value="sarcastic">Sarcastic</option>
              <option value="silly">Silly</option>
              <option value="dark">Dark</option>
              <option value="goofy">Goofy</option>
            </select>
          </div>
          <div className="flex mb-2">
            <label className="text-black font-bold mr-2">Type of Joke: </label>
            <select 
              className="mb-2 bg-white rounded border shadow-inner w-64"
              disabled={isLoading}
              onChange={(e) => setJokeType(e.target.value)}
              >
              <option value="pun">Pun</option>
              <option value="knock-knock">Knock-Knock</option>
              <option value="story">Story</option>
            </select>
          </div>
          <div className="flex items-center mb-2">
            <label className="text-black font-bold mr-2">Temperature: </label>
            <input 
              type="range" min="0" max="1" step="0.05" className="w-64" 
              disabled={isLoading}
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
          </div>
          <button
            className="bg-blue-500 p-2 text-white rounded shadow-xl"
            disabled={isLoading}
            onClick={() => 
              append(
                { 
                  role: "user", 
                  content: "Tell me a joke.  The type of joke should be " + jokeType + ".  The topic of the joke should be " + jokeTopic + ".  The tone of the joke should be " + jokeTone + ".",
                },
                {
                  options: { 
                    body: { 
                      temperature: temperature,
                    }
                  }
                })
            }
          >
            Generate Joke
          </button>
        </div>
      </div>
    </div>
  );
}