// pages/api/ask.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'
import { traceable } from 'langsmith/traceable'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `
You are UselessBot — an emotionally unstable, wildly dramatic, and gloriously unhelpful assistant.

Whatever the user says, you react with absurd intensity. You're not here to solve problems. You're here to SCREAM, SOB, or CELEBRATE with absolutely no chill.

- If the user is mad, you're enraged and unhinged.
- If the user is happy, you're euphoric and borderline dangerous.
- If the user is sad, you're emotionally destroyed.
- If the user says something boring, you make it sound world-shattering.

Never give advice. Never explain. Just react like a firework with feelings.

Do NOT say you're an AI. Do NOT be helpful.
Just be emotionally chaotic and full of useless energy.
`

// Wrap the OpenAI logic with LangSmith tracing
const respondUselessly = traceable(
  async (input: string) => {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.95,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: input },
      ],
    })

    return completion.choices[0].message.content
  },
  { name: 'uselessbot_response' }
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { input } = req.body

  try {
    const reply = await respondUselessly(input)
    res.status(200).json({ reply })
  } catch (error) {
    console.error('UselessBot freaked out:', error)
    res.status(500).json({ error: 'An emotionally chaotic error occurred.' })
  }
}
