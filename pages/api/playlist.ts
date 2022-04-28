import { getPlaylist } from '../../lib/api'

export default async (_req, res) => {
  const playlist = await getPlaylist()
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300')
  res.end(JSON.stringify({ playlist }))
}
