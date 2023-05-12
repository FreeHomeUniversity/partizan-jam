import * as React from 'react'
import { InferGetStaticPropsType } from 'next'
import { RichText } from 'prismic-dom'
import truncate from 'lodash/truncate'
import { NextSeo } from 'next-seo'

import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { getAllArtists } from '../../lib/api'
// import { linkResolver, htmlSerializer } from '../../lib/prismic'

export async function getStaticProps({ preview = false, previewData }) {
  const prismicArtists = await getAllArtists(previewData)

  const title = 'Artists'

  const artists = []

  prismicArtists.forEach(({ node }) => {
    artists.push({
      id: node._meta.id,
      uid: node._meta.uid,
      title: RichText.asText(node.title || []),
      description: truncate(RichText.asText(node.description || []), {
        length: 240,
        separator: /,? +/,
      }),
      thumbnail: {
        url: node.image?.url || null,
        alt: node.image?.alt || RichText.asText(node.title || []),
      },
    })
  })

  return {
    props: { preview, title, artists },
  }
}

export default function StoriesPage({ title, artists }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title={title}
        openGraph={{
          url: `https://partisan-jam.fhu.art/artists`,
          title: title,
        }}
      />
      <div className="grid place-start">
        <Box>
          <h1>{title}</h1>
        </Box>
        <Box p={0} className="grid-cols-2">
          {artists.map((artist) => (
            <Card
              key={artist.id}
              image={artist.thumbnail.url}
              alt={artist.thumbnail.alt}
              href={`/artists/[uid]`}
              as={`/artists/${artist.uid}`}
              title={artist.title}
              subtitle={artist.description}
            />
          ))}
        </Box>
      </div>
    </>
  )
}
