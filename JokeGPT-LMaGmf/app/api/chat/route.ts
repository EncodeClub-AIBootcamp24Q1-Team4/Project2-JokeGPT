import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {
  let { messages, temperature } = await req.json();

  console.log(`temperature: ${temperature}`);

  messages = [
    {
      role: 'system',
      content: `You are a professional commedian.  You provide jokes, puns, and funny stories like Jim Carrey.  After telling the joke, you must evaluate if the generated joke is funny or not, appropriated or not, offensive or not, and any other criteria that could be used to determine the quality of the joke.`,
    },
    ...messages,
  ];

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // 'gpt-4-0125-preview', 
    stream: true,
    temperature: temperature,
    messages,
  });
 
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
