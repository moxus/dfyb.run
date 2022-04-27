import { load } from 'cheerio'
import { RequestListener } from 'http'
import fetch from 'node-fetch'

const listener: RequestListener = async (request, response) => {
  const parameters = new URL(request.url ?? '', `https://${request?.headers.host ?? 'example.com'}`).searchParams

  console.log(request)

  let athleteId = parameters.get('aid')?.toUpperCase() ?? ''

  if (/^$|^A[1-9]?$|^A[1-9][0-9]{0,8}$/.test(athleteId) === false) {
    return response.writeHead(400).end('Invalid Athlete ID')
  }

  athleteId = athleteId.substring(1)

  const headers = {
    'user-agent': request.headers['user-agent'] ?? 'Mozilla/5.0',
    'X-Forwarded-For': request.socket.remoteAddress ?? '::0',
    accept: 'text/html,application/xhtml+xml,application/xml',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': '*'
  }

  console.log(headers)

  const parkrunResponse = await fetch(`https://www.parkrun.org.uk/parkrunner/${athleteId}/`, {
    method: 'GET',
    headers
  })

  if (parkrunResponse.ok === false) {
    const output = await parkrunResponse.text()
    console.log(output)
    return response.writeHead(502).end('Unable to retrieve data from parkrun')
  }

  const profilePageContents = load(await parkrunResponse.text())
  const athleteName = profilePageContents('h2').text()

  response.writeHead(200, {
    'Content-Type': 'text/plain'
  }).end(athleteName)
}

export default listener
