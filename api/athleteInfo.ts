import { load } from 'cheerio'
import fetch from 'cross-fetch'
import { RequestListener, ServerResponse } from 'http'
import Redis from 'ioredis'
import { format } from 'util'

const listener: RequestListener = async (request, response) => {
  const writeResponse = createResponder(response)
  const parameters = new URL(request.url ?? '', `https://${request?.headers.host ?? 'example.com'}`).searchParams

  const athleteId = parameters.get('aid')?.toUpperCase()

  if (!athleteId) {
    return writeResponse(400, 'Athlete ID is required')
  }

  if (/^$|^A[1-9]?$|^A[1-9][0-9]{0,8}$/.test(athleteId) === false) {
    return writeResponse(400, `Invalid Athlete ID (${athleteId})`)
  }

  const trimmedAthleteId = athleteId.substring(1)

  // First, check Redis if we already have a cached name
  const redisCache = new Redis(process.env.REDIS_URL ?? '')
  const cachedResponse = await redisCache.get(trimmedAthleteId)

  if (cachedResponse) {
    return writeResponse(200, cachedResponse)
  }

  // Else, fetch from parkrun profile page
  const profileURL = format(process.env.PROXY_URL ?? 'https://www.parkrun.us/parkrunner/%i', trimmedAthleteId)
  console.log({ profileURL })
  const parkrunResponse = await fetch(profileURL, {
    headers: {
      'x-api-key': process.env.PROXY_KEY ?? ''
    }
  })

  // Parse the name from the result
  const profilePageContents = load(await parkrunResponse.text())
  const athleteName = profilePageContents('h2').text()

  if (parkrunResponse.ok === false || athleteName.trim() === '') {
    const pageTitle = profilePageContents('title').text()
    const isCaptchaChallenge = pageTitle === 'Human Verification'
    return writeResponse(502, isCaptchaChallenge ? 'CAPTCHA challenge' : `Unable to retrieve data from parkrun (received HTTP ${parkrunResponse.status})`)
  }

  // Format the resulting data
  const returnResponse = JSON.stringify({
    name: athleteName
  })

  // Store this in the cache for 72 hours
  await redisCache.setex(trimmedAthleteId, 60 * 60 * 72, returnResponse)

  // Return the response
  return writeResponse(200, returnResponse)
}

const createResponder = (response: ServerResponse) => (code: number, content: string) => {
  response.writeHead(code, {
    'Content-Type': 'application/json',
    'Cache-Control': 'max-age=3600'
  }).end(code === 200 ? content : JSON.stringify({ error: content }))
}

export default listener
