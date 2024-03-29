import * as React from 'react'
import { RichText } from 'prismic-dom'
import { InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'

import { getAboutFHU } from '../lib/api'
import { linkResolver, htmlSerializer } from '../lib/prismic'
import { Box } from '../components/Box'

export async function getStaticProps() {
  const aboutFHU = await getAboutFHU()

  const title = RichText.asText(aboutFHU.data.title || [])
  const body = []

  aboutFHU.data.body.forEach(({ slice_type, items, primary }) => {
    switch (slice_type) {
      case 'text':
        body.push({
          slice_type,
          html: RichText.asHtml(primary.text || [], linkResolver, htmlSerializer),
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

export default function About({ aboutFHU, title, body }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { image } = aboutFHU.data

  return (
    <>
      <NextSeo
        title={title}
        openGraph={{
          url: 'https://partisan-jam.fhu.art/free-home-university',
          title: title,
        }}
      />
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
                <Box key={html} className="md:grid-cols-text">
                  <div dangerouslySetInnerHTML={{ __html: html }} className="col-start-2 space-y-4 prose md:prose-lg" />
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
