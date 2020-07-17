import Head from 'next/head'
import { RichText } from 'prismic-dom'

import { Box } from '../components/Box'
import { getHomepage } from '../lib/api'

export default function Home({ title, songs }) {
  console.log(songs)

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box p={0}>
        <Box>
          <h1 className="text-5xl font-bold">{title}</h1>
        </Box>
      </Box>
    </>
  )
}

export async function getStaticProps({ preview = false, previewData }) {
  const [homepage, songs] = await getHomepage(previewData)

  const title = RichText.asText(homepage.title)

  return {
    props: { preview, title, songs },
  }
}
