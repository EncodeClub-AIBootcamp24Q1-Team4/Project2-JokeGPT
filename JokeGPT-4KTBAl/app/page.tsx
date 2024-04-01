'use client';
 
import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
 
export default function Chat() {
  const { messages, input, isLoading, append, handleInputChange, handleSubmit } = useChat();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [jokeTopic, setJokeTopic] = useState('random');
  const [jokeTone, setJokeTone] = useState('sarcastic');
  const [jokeStyle, setJokeStyle] = useState('one-liners');



  const [jokeRating, setJokeRating] = useState('funny');

  let lowRating: string;
  let highRating: string;

  if (jokeRating == 'funny') {
    lowRating = "not funny at all";
  } else if (jokeRating == 'appropriate') {
    lowRating = "not appropriate for a 13 year old";
  } else if (jokeRating == 'offensive') {
    lowRating = "ultimate dad joke";;
  }

  if (jokeRating == 'funny') {
    highRating = "rolling on the floor laughing level";
  } else if (jokeRating == 'appropriate') {
    highRating = "appropriate to tell your grandma at a funeral";
  } else if (jokeRating == 'offensive') {
    highRating = "so offensive you are canceled for saying it";
  }

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex w-full h-screen max-w-7xl py-24 mx-auto items-stretch">
      <div className='flex-2'>
        <div className='flex flex-col justify-center mb-2 items-center'>
          <div className='flex flex-col mb-2'>
            <label className="text-white font-bold mr-2">
              Style: 
            </label>
              <select 
                className="mb-2 text-black bg-white rounded border shadow-inner w-64"
                disabled={isLoading}
                onChange={(e) => setJokeStyle(e.target.value)}
                >
                <option value="one-liners">One-liners</option>
                <option value="puns">Puns</option>
                <option value="knock-knock">Knock-Knock</option>
                <option value="stories">Stories</option>
                <option value="dark">Dark Humor</option>
              </select>
            <label className="text-white font-bold mr-2">
              Tone: 
            </label>
              <select 
                className="mb-2 text-black bg-white rounded border shadow-inner w-64"
                disabled={isLoading}
                onChange={(e) => setJokeTone(e.target.value)}
                >
                <option value="sarcastic">Sarcastic</option>
                <option value="deadpan">Deadpan</option>
                <option value="slapstick">Slapstick</option>
                <option value="self-depreciating">Self-Deprecating</option>
                <option value="satirical">Satirical</option>
              </select>
            <label className="text-white font-bold mr-2">
              Topic: 
            </label>
              <select 
                className="mb-2 text-black bg-white rounded border shadow-inner w-64"
                disabled={isLoading}
                onChange={(e) => setJokeTopic(e.target.value)}
                >
                <option value="random">Random</option>
                <option value="ai">AI</option>
                <option value="current-events">Current Events</option>
                <option value="food">Food</option>
                <option value="sports">Sports</option>
              </select>
          </div>
          {messages.length == 0 && (
            <button
              className='bg-blue-500 p-2 text-white rounded shadow-xl'
              disabled={isLoading}
              onClick={() => append({ role: "user", content: `Tell me a joke about ${jokeTopic}, in the style of ${jokeStyle}, with the tone of ${jokeTone}, and it better be funny.`})}
            >
              Generate Joke
            </button>
          )}
          {messages.length > 1 && !isLoading && (
            <button
              className='bg-blue-500 p-2 text-white rounded shadow-xl mb-2'
              disabled={isLoading}
              onClick={() => append({ role: "user", content: `Tell me a joke about ${jokeTopic}, in the style of ${jokeStyle}, with the tone of ${jokeTone}, and it better be funny`})}
            >
              Generate New Joke
            </button>
          )}
          {messages.length > 1 && !isLoading && (
            <><div className='flex mb-2'>
              <label className="text-white font-bold mr-2">
                Rate joke on:
              </label>
              <select
                className="mb-2 text-black bg-white rounded border shadow-inner w-48"
                disabled={isLoading}
                onChange={(e) => setJokeRating(e.target.value)}
              >
                <option value="funny">Funniness</option>
                <option value="appropriate">Appropriateness</option>
                <option value="offensive">Offensiveness</option>
              </select>
            </div><button
              className='bg-red-500 p-2 text-white rounded shadow-xl mb-2'
              disabled={isLoading}
              onClick={() => append({ role: "user", content: `Is the previous joke ${jokeRating}? Rate it on a scale of 1-10, with 1 being ${lowRating} and 10 is ${highRating}. Explain what part of the joke you liked or didnt.` })}
            >
                Rate Joke
              </button></>
          )}
        </div>
      </div>
      <div className='flex-1 overflow-auto mb-8' ref={messagesContainerRef}>
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-green-700 p-3 m-2 rounded-lg"
                : "bg-slate-700 p-3 m-2 rounded-lg"
            }`}
            >
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}
        {
          isLoading && (
            <div className="flex justify-end pr-4">
              <span className="animate-bounce">...</span>
            </div>
          )
        }
      </div>
      
      
    </div>
  );
}