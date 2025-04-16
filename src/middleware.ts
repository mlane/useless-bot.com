import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
})

export async function middleware(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1'

  const { success } = await ratelimit.limit(ip)

  if (!success) {
    const key = `limit:violations:${ip}:${new Date()
      .toISOString()
      .slice(0, 10)}`
    console.warn(`[RATE LIMIT BLOCKED] IP: ${ip} - ${new Date().toISOString()}`)
    const alreadyLogged = await redis.get(key)

    if (!alreadyLogged) await redis.set(key, '1', { ex: 60 * 60 * 24 })

    return new NextResponse(
      JSON.stringify({
        reply:
          "WHOA! I'm emotionally exhausted. You've hit your chaos limit. Try again soon, you storm of feelings!",
      }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/ask',
}
