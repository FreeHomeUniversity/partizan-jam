import * as React from 'react'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { RichText } from 'prismic-dom'

import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { getAllArtists } from '../../lib/api'
import { linkResolver, htmlSerializer } from '../../lib/prismic'

export async function getStaticProps({ preview = false, previewData }) {
  const prismicArtists = await getAllArtists(previewData)

  const title = 'Artists'

  const artists = []

  prismicArtists.forEach(({ node }) => {
    artists.push({
      id: node._meta.id,
      uid: node._meta.uid,
      title: RichText.asText(node.title),
      description: RichText.asHtml(node.description, linkResolver, htmlSerializer),
      thumbnail: {
        url: node.image.url,
        alt: node.image.alt || RichText.asText(node.title),
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
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box p={0} className="place-start">
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
      </Box>
    </>
  )
}
