import classNames from 'classnames'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [response, setResponse] = useState('')

  useEffect(() => {
    if (!!navigator?.share) setCanShare(true)
  }, [])

  const onReset = () => {
    setResponse('')
    setInput('')
  }

  const onShare = async () => {
    try {
      if (canShare) {
        await window.navigator.share({
          title: 'UselessBot — The Emotionally Unstable AI',
          text: 'An emotionally unstable AI that overreacts to everything you say.\nScream. Sob. Celebrate. It’s gloriously unhelpful.',
          url: 'https://useless-bot.com',
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setisLoading(true)
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
    setisLoading(false)
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
        <section className='w-full space-y-6 max-w-md'>
          <header className='text-center'>
            <Image
              className='mx-auto w-16 h-16 rounded-full shadow'
              alt='UselessBot logo'
              src='/logo.png'
              width={64}
              height={64}
            />
            <h1 className='text-3xl -mt-2 font-bold'>UselessBot</h1>
          </header>
          <form onSubmit={onSubmit} className='space-y-4'>
            <input
              type='text'
              value={input}
              maxLength={280}
              onChange={event => setInput(event.target.value)}
              placeholder='Say something useless...'
              className='w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-white'
            />
            <button
              type='submit'
              disabled={isLoading || !input?.trim()}
              className='w-full p-3 bg-pink-600 underline cursor-pointer rounded-md hover:bg-pink-700 transition disabled:cursor-not-allowed disabled:opacity-70'
            >
              {isLoading ? 'Thinking...' : 'Submit'}
            </button>
          </form>
          {response && (
            <>
              <div className='p-4 bg-gray-900 rounded-md border border-gray-700'>
                <p>{response}</p>
              </div>
              <div
                className={classNames(
                  'flex gap-4 justify-between items-center',
                  {
                    'flex-col': !canShare,
                  }
                )}
              >
                <button
                  type='reset'
                  className='text-sm underline cursor-pointer text-pink-400 hover:text-pink-300 transition'
                  onClick={onReset}
                >
                  Reset
                </button>
                {canShare && (
                  <button
                    type='button'
                    className='text-sm cursor-pointer bg-pink-800 px-3 py-1 rounded-md hover:bg-pink-700 transition'
                    onClick={onShare}
                  >
                    💥 Share the meltdown
                  </button>
                )}
              </div>
            </>
          )}
          <footer className='text-sm text-center text-gray-700 mt-10'>
            Made by{' '}
            <a
              href='https://github.com/mlane'
              className='underline transition opacity-100 hover:opacity-70'
            >
              Marcus Lane
            </a>{' '}
            · Powered by GPT-4o · Built for chaos
          </footer>
        </section>
      </main>
    </>
  )
}
