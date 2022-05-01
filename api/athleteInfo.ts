import { load } from 'cheerio'
import fetch from 'cross-fetch'
import { RequestListener, ServerResponse } from 'http'
import Redis from 'ioredis'
import { format } from 'util'

const listener: RequestListener = async (request, response) => {
  const parameters = new URL(request.url ?? '', `https://${request?.headers.host ?? 'example.com'}`).searchParams
  let athleteId = parameters.get('aid')?.toUpperCase() ?? ''

  if (/^$|^A[1-9]?$|^A[1-9][0-9]{0,8}$/.test(athleteId) === false) {
    return response.writeHead(400).end(`Invalid Athlete ID (${athleteId})`)
  } else {
    athleteId = athleteId.substring(1)
  }

  // First, check Redis if we already have a cached name
  const redisCache = new Redis(process.env.REDIS_URL ?? '')
  const cachedResponse = await redisCache.get(athleteId)

  if (cachedResponse) {
    return writeJSON(response, cachedResponse)
  }

  // Else, fetch from parkrun profile page
  const profileURL = format(process.env.PROXY_URL ?? 'https://www.parkrun.org.uk/parkrunner/%i', athleteId.substring(1))
  const parkrunResponse = await fetch(profileURL, {
    headers: {
      'x-api-key': process.env.PROXY_KEY ?? ''
    }
  })

  // Parse the name from the result
  const profilePageContents = load(await parkrunResponse.text())
  const athleteName = profilePageContents('h2').text()

  if (parkrunResponse.ok === false || athleteName.trim() === '') {
    console.error(profilePageContents.text())
    return response.writeHead(502).end(`Unable to retrieve data from parkrun (received HTTP ${parkrunResponse.status})`)
  }

  // Format the resulting data
  const returnResponse = JSON.stringify({
    name: athleteName
  })

  // Store this in the cache for 24 hours
  await redisCache.setex(athleteId, 60 * 60 * 24, returnResponse)

  // Return the response
  return writeJSON(response, returnResponse)
}

const writeJSON = (response: ServerResponse, content: string) => {
  response.writeHead(200, { 'Content-Type': 'application/json' }).end(content)
}

export default listener
