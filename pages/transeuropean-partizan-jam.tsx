import Head from 'next/head'
import { RichText } from 'prismic-dom'

import { getAboutTEPJ } from '../lib/api'
import { linkResolver, htmlSerializer } from '../lib/prismic'
import { Box } from '../components/Box'

export default function About({ aboutTEPJ, title, body }) {
  const { image } = aboutTEPJ.data

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
      <Box className="grid-flow-row-dense grid-cols-3" p={0}>
        {body.map(({ slice_type, items, html }) => {
          switch (slice_type) {
            case 'text':
              return (
                <Box key={html} className="col-span-3">
                  <div
                    dangerouslySetInnerHTML={{ __html: html }}
                    className="max-w-3xl text-md"
                  />
                </Box>
              )
            case 'Lead':
              return (
                <Box key={html} className="col-span-3">
                  <div
                    dangerouslySetInnerHTML={{ __html: html }}
                    className="w-full max-w-3xl text-xl"
                  />
                </Box>
              )
            case 'video':
              return (
                <Box key={html}>
                  <div
                    className="grid w-full place-center"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </Box>
              )
            case 'image':
              return (
                <Box key={items} className="col-span-3" p={0}>
                  <>
                    {items.map(({ imagesrc, caption }) => (
                      <Box key={imagesrc.url}>
                        <picture>
                          <img
                            src={imagesrc.url}
                            alt={caption?.[0]?.text || ''}
                          />
                        </picture>
                      </Box>
                    ))}
                  </>
                </Box>
              )
            default:
              return null
          }
        })}
      </Box>
    </>
  )
}

export async function getStaticProps() {
  const aboutTEPJ = await getAboutTEPJ()

  const title = RichText.asText(aboutTEPJ.data.title)
  const body = []

  aboutTEPJ.data.body.forEach(({ slice_type, items, primary }) => {
    switch (slice_type) {
      case 'text':
        body.push({
          slice_type,
          html: RichText.asHtml(primary.text, linkResolver, htmlSerializer),
        })
        break
      case 'Lead':
        body.push({
          slice_type,
          html: RichText.asHtml(primary.text, linkResolver, htmlSerializer),
        })
        break
      case 'video':
        body.push({
          slice_type,
          html: primary.link.html,
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
    props: { aboutTEPJ, title, body },
  }
}
