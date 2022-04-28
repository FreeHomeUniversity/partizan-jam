import { getAllByID } from 'lib/api'
import type { NextApiRequest, NextApiResponse } from 'next'

const PATHS = {
  artist: 'artists',
  song: 'songs',
  musiciant: 'musiciants',
} as const

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body as PrismicWebhook

  // Check for secret to confirm this is a valid request
  if (body.secret !== process.env.PRISMIC_WEBHOOK_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const toRevalidate = ['/']
  const allDocuments = await getAllByID(body.documents || [])
  allDocuments.array.forEach(({ node }) => {
    if (node?._meta?.uid && PATHS[node._meta.type]) {
      toRevalidate.push(`/${PATHS[node._meta.type]}`)
      toRevalidate.push(`/${PATHS[node._meta.type]}/${node._meta.uid}`)
    }
  })

  try {
    await Promise.all(toRevalidate.map(res.unstable_revalidate))

    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}

interface PrismicWebhook {
  type: string
  secret: string
  masterRef: string
  domain: string
  apiUrl: string
  releases?: Releases
  bookmarks?: Bookmarks
  collection?: Bookmarks
  tags?: Tags
  documents?: string[]
}

interface Tags {
  addition: Addition2[]
  deletion: Addition2[]
}

interface Addition2 {
  id: string
}

interface Bookmarks {}

interface Releases {
  addition: Addition[]
  update: Addition[]
  deletion: Addition[]
}

interface Addition {
  id: string
  ref: string
  label: string
  documents: string[]
}
