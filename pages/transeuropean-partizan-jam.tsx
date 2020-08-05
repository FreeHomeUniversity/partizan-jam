import * as React from 'react'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { RichText } from 'prismic-dom'

import { getAboutTEPJ } from '../lib/api'
import { linkResolver, htmlSerializer } from '../lib/prismic'
import { Box } from '../components/Box'
import { Image } from '../components/Image'
import { YouTube } from '../components/YouTube'

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
          html: primary.link.embed_url.replace('https://www.youtube.com/watch?v=', '').replace(/&.+/, ''),
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

export default function About({ aboutTEPJ, title, body }: InferGetStaticPropsType<typeof getStaticProps>) {
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
      <Box className="grid-cols-3" p={0}>
        {body.map(({ slice_type, items, html }) => {
          switch (slice_type) {
            case 'text':
              return (
                <Box key={html} className="grid w-full col-span-3 md:grid-cols-text">
                  <div
                    dangerouslySetInnerHTML={{ __html: html }}
                    className="space-y-4 prose md:col-start-2 md:prose-lg"
                  />
                </Box>
              )
            case 'Lead':
              return (
                <Box key={html} className="grid w-full col-span-3 md:grid-cols-text">
                  <div
                    dangerouslySetInnerHTML={{ __html: html }}
                    className="space-y-4 prose prose-lg md:col-start-2 md:prose-2xl"
                  />
                </Box>
              )
            case 'video':
              return (
                <Box key={html} className="col-span-3 md:col-span-1">
                  <YouTube youTubeId={html} />
                </Box>
              )
            case 'image':
              return (
                <Box key={items} className="grid col-span-3 md:grid-cols-3" p={0}>
                  <>
                    {items.map(({ imagesrc, caption }) => (
                      <Box key={imagesrc.url} className="md:col-start-2">
                        <Image src={imagesrc.url} alt={caption?.[0]?.text || ''} />
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
