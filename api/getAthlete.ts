import { load } from 'cheerio'
import { RequestListener } from 'http'
import fetch from 'cross-fetch'

const listener: RequestListener = async (request, response) => {
  const parameters = new URL(request.url ?? '', `https://${request?.headers.host ?? 'example.com'}`).searchParams

  const athleteId = parameters.get('aid')?.toUpperCase() ?? ''

  if (/^$|^A[1-9]?$|^A[1-9][0-9]{0,8}$/.test(athleteId) === false) {
    return response.writeHead(400).end('Invalid Athlete ID')
  }

  const realIP = (Array.isArray(request.headers['x-real-ip']) ? request.headers['x-real-ip'][0] : request.headers['x-real-ip']) ?? '127.0.0.1'

  const parkrunResponse = await fetch(`https://www.parkrun.org.uk/parkrunner/${athleteId.substring(1)}/`, {
    method: 'GET',
    headers: {
      'user-agent': request.headers['user-agent'] ?? 'Mozilla/5.0',
      'x-real-ip': realIP,
      'x-forwarded-for': realIP,
      forwarded: `by=dfyb.run, for:${realIP}`,
      cookie: request.headers.cookie ?? ''
    }
  })

  const profilePageContents = load(await parkrunResponse.text())
  const athleteName = profilePageContents('h2').text()

  if (parkrunResponse.ok === false || athleteName.trim() === '') {
    console.error(profilePageContents.text())
    return response.writeHead(502).end('Unable to retrieve data from parkrun')
  }

  response.writeHead(200, {
    'Content-Type': 'text/plain'
  }).end(athleteName)
}

export default listener
