import type { ActionFunctionArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { useChat } from 'ai/react'
import OpenAI from 'openai'
import { useEffect, useRef, useState } from 'react'

const openai = new OpenAI({
	apiKey: import.meta.env.OPENAI_API_KEY
})

export async function action({ request }: ActionFunctionArgs) {
	const { messages, temperature } = await request.json()

	// Ask OpenAI for a streaming chat completion given the prompt
	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		stream: true,
		temperature,
		messages: [
			{
				role: 'system',
				content:
					'You are a professional standup comedian and TV host. You provide jokes, puns, and funny stories like Jon Stewart. After telling the joke, you must evaluate if the generated joke is funny or not, appropriated or not, offensive or not, and any other criteria that could be used to determine the quality of the joke.'
			},
			...messages
		]
	})

	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response)

	// Respond with the stream
	return new StreamingTextResponse(stream)
}

export default function Chat() {
	const { messages, handleSubmit, isLoading, append } = useChat({
		api: '/?index'
	})

	const [jokeType, setJokeType] = useState('pun')
	const [jokeTopic, setJokeTopic] = useState('people')
	const [jokeTone, setJokeTone] = useState('goofy')
	const [temperature, setTemperature] = useState(0.5)

	const messagesContainerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// hack to remove html content from ai messages
		messages.map(message => {
			if (message.role === 'assistant') {
				// "actionData":{"routes/_index"
				const pattern = /,"actionData":\{"routes\/_index":"([^"]+)"\}/
				const matches = pattern.exec(message.content)
				if (matches?.[1]) {
					messages.pop()
					messages.push({ ...message, content: matches[1] })
				}
			}
		})

		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop =
				messagesContainerRef.current.scrollHeight
		}
	}, [messages])

	return (
		<div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch">
			<h1 className="text-3xl font-bold text-center mb-4">JokeGPT</h1>
			<div className="overflow-auto mb-8 w-full" ref={messagesContainerRef}>
				{messages.map(m => (
					<div
						key={m.id}
						className={`whitespace-pre-wrap break-words ${
							m.role === 'user'
								? 'p-3 m-2 rounded-lg'
								: 'bg-slate-300 p-3 m-2 mb-9 rounded-lg'
						}`}
					>
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
							onChange={e => setJokeTopic(e.target.value)}
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
							onChange={e => setJokeTone(e.target.value)}
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
							onChange={e => setJokeType(e.target.value)}
						>
							<option value="pun">Pun</option>
							<option value="knock-knock">Knock-Knock</option>
							<option value="story">Story</option>
						</select>
					</div>
					<div className="flex items-center mb-2">
						<label className="text-black font-bold mr-2">Temperature: </label>
						<input
							type="range"
							min="0"
							max="1"
							step="0.05"
							className="w-64"
							disabled={isLoading}
							value={temperature}
							onChange={e => setTemperature(Number.parseFloat(e.target.value))}
						/>
					</div>
					<button
						className="bg-blue-500 p-2 text-white rounded shadow-xl"
						type="button"
						disabled={isLoading}
						onClick={() =>
							append(
								{
									role: 'user',
									content: `Tell me a joke.  The type of joke should be ${jokeType}.  The topic of the joke should be ${jokeTopic}.  The tone of the joke should be ${jokeTone}.`
								},
								{
									options: {
										body: {
											temperature
										}
									}
								}
							)
						}
					>
						Generate Joke
					</button>
					<Form
						method="post"
						onSubmit={handleSubmit}
						className="flex justify-center"
					>
						<input
							type="hidden"
							name="messages"
							value={JSON.stringify(messages)}
						/>
					</Form>
				</div>
			</div>
		</div>
	)
}
