import { RichText } from 'prismic-dom'

import { getHomepage } from '../../lib/api'

export default async (req, res) => {
  const homepage = await getHomepage(false)

  const playlist = homepage.playlist.map(({ track, track_caption }) => ({
    url: track.url,
    caption: RichText.asText(track_caption),
  }))
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  res.end(JSON.stringify({ playlist }))
}
