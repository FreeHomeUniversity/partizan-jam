import Head from 'next/head'
import { RichText } from 'prismic-dom'

import { getAboutKots } from '../lib/api'
import { linkResolver, htmlSerializer } from '../lib/prismic'
import { Box } from '../components/Box'

export default function About({ aboutKots, title, body }) {
  const { image } = aboutKots.data

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <h1 className="text-4xl font-bold">{title}</h1>
      </Box>
      <Box>
        <img src={image.url} alt={image.alt || ''} />
      </Box>
      <div>
        {body.map(({ slice_type, items, html }) => {
          switch (slice_type) {
            case 'text':
              return (
                <Box key={html}>
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </Box>
              )
            case 'image':
              return (
                <Box key={items} className="grid-cols-3" p={0}>
                  <>
                    {items.map(({ imagesrc, caption }) => (
                      <Box key={imagesrc.url}>
                        <img src={imagesrc.url} alt={caption?.[0]?.text || ''} />
                      </Box>
                    ))}
                  </>
                </Box>
              )
            default:
              return null
          }
        })}
      </div>
    </>
  )
}

export async function getStaticProps() {
  const aboutKots = await getAboutKots()

  const title = RichText.asText(aboutKots.data.title)
  const body = []

  aboutKots.data.body.forEach(({ slice_type, items, primary }) => {
    switch (slice_type) {
      case 'text':
        body.push({
          slice_type,
          html: RichText.asHtml(primary.text, linkResolver, htmlSerializer),
        })
        break
      case 'image':
        body.push({ slice_type, items })
        break
      default:
        break
    }
  })

  return {
    props: { aboutKots, title, body },
  }
}
