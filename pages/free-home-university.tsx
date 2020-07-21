import Head from 'next/head'
import { RichText } from 'prismic-dom'

import { getAboutFHU } from '../lib/api'
import { linkResolver, htmlSerializer } from '../lib/prismic'
import { Box } from '../components/Box'

export default function About({ aboutFHU, title, body }) {
  const { image } = aboutFHU.data

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
                        <img
                          src={imagesrc.url}
                          alt={caption?.[0]?.text || ''}
                        />
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
  const aboutFHU = await getAboutFHU()

  const title = RichText.asText(aboutFHU.data.title)
  const body = []

  aboutFHU.data.body.forEach(({ slice_type, items, primary }) => {
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
    props: { aboutFHU, title, body },
  }
}
