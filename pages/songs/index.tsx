import * as React from 'react'
import Head from 'next/head'
import { RichText } from 'prismic-dom'
import { InferGetStaticPropsType } from 'next'

import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { getAllSongs } from '../../lib/api'
import { linkResolver, htmlSerializer } from '../../lib/prismic'

export async function getStaticProps({ preview = false, previewData }) {
  const prismicSongs = await getAllSongs(previewData)

  const title = 'Songs'

  const songs = []

  prismicSongs.forEach(({ node }) => {
    songs.push({
      id: node._meta.id,
      uid: node._meta.uid,
      title: RichText.asText(node.title),
      description: RichText.asHtml(node.description, linkResolver, htmlSerializer),
      thumbnail: {
        url: node.video.thumbnail_url,
        alt: node.video.title || RichText.asText(node.title),
      },
    })
  })

  return {
    props: { preview, title, songs },
  }
}

export default function SongsPage({ title, songs }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid place-start">
        <Box>
          <h1>{title}</h1>
        </Box>
        <Box p={0} className="grid-cols-3">
          {songs.map((song) => (
            <Card
              key={song.id}
              image={song.thumbnail.url}
              alt={song.thumbnail.alt}
              href={`/songs/${song.uid}`}
              title={song.title}
              subtitle={song.description}
            />
          ))}
        </Box>
      </div>
    </>
  )
}
