import * as React from 'react'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { RichText } from 'prismic-dom'

import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { getAllSongs } from '../../lib/api'
import { linkResolver, htmlSerializer } from '../../lib/prismic'

export async function getStaticProps({ preview = false, previewData }) {
  const prismicSongs = await getAllSongs(previewData)

  const title = 'Stories'

  const songs = []

  prismicSongs.forEach(({ node }) => {
    songs.push({
      id: node._meta.id,
      uid: node._meta.uid,
      title: RichText.asText(node.title),
      description: RichText.asHtml(node.description, linkResolver, htmlSerializer),
    })
  })

  return {
    props: { preview, title, songs },
  }
}

export default function StoriesPage({ title, songs }: InferGetStaticPropsType<typeof getStaticProps>) {
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
          {songs.map((song) => (
            <Card
              key={song.id}
              href={`/stories/[uid]`}
              as={`/stories/${song.uid}`}
              title={song.title}
              subtitle={song.description}
            />
          ))}
        </Box>
      </Box>
    </>
  )
}
