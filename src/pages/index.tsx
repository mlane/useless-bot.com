import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setResponse('')
    const response = await fetch('/api/ask', {
      body: JSON.stringify({
        input,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const data = await response.json()
    setResponse(data.reply)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>UselessBot — The Emotionally Unstable AI</title>
        <meta
          property='og:title'
          content='UselessBot — The Emotionally Unstable AI'
        />
        <meta
          property='og:description'
          content="Scream. Sob. Celebrate. UselessBot mirrors your chaos with chaotic vibes. It's gloriously unhelpful."
        />
        <meta property='og:image' content='/uselessbot-banner.png' />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <main className='flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white'>
        <div className='flex flex-col items-center mb-6'>
          <Image
            className='w-16 h-16 rounded-full shadow'
            alt='UselessBot logo'
            src='/logo.png'
            width={64}
            height={64}
          />
          <h1 className='text-3xl -mt-2 font-bold'>UselessBot</h1>
        </div>
        <form onSubmit={onSubmit} className='w-full max-w-md'>
          <input
            type='text'
            value={input}
            maxLength={280}
            onChange={event => setInput(event.target.value)}
            placeholder='Say something useless...'
            className='w-full p-3 rounded-md bg-gray-800 border border-gray-600 mb-4 text-white'
          />
          <button
            type='submit'
            disabled={loading || !input.trim()}
            className='w-full p-3 bg-pink-600 rounded-md hover:bg-pink-700 disabled:opacity-50'
          >
            {loading ? 'Thinking...' : 'Submit'}
          </button>
        </form>
        {response && (
          <div className='mt-6 max-w-md p-4 bg-gray-900 rounded-md border border-gray-700'>
            <p>{response}</p>
            <button
              className='mt-4 text-sm underline text-pink-400 hover:text-pink-300'
              onClick={() => {
                setResponse('')
                setInput('')
              }}
            >
              Reset
            </button>
          </div>
        )}
        <footer className='text-sm text-center text-gray-600 mt-10'>
          Made by{' '}
          <a href='https://github.com/mlane' className='underline'>
            Marcus Lane
          </a>{' '}
          · Powered by GPT-4o · Built for chaos
        </footer>
      </main>
    </>
  )
}
