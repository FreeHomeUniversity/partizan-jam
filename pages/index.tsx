import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { RichText } from 'prismic-dom'
import { truncate } from 'lodash'

import { Box } from '../components/Box'
import { Card } from '../components/Card'
import { getHomepage, getAllSongs, getAboutKots, getAboutFHU, getAboutTEPJ } from '../lib/api'
import { linkResolver, htmlSerializer } from '../lib/prismic'

export default function Home({ title, songs, kots, fhu, tepj }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box p={0}>
        <Box>
          <h1>{title}</h1>
        </Box>
        <Box p={0} className="grid-cols-none md:grid-cols-3">
          <Card href={'/free-home-university'} title={fhu.title} subtitle={fhu.description} />
          <Card href={'/arkadiy-kots-band'} title={kots.title} subtitle={kots.description} />
          <Card href={'/transeuropean-partizan-jam'} title={tepj.title} subtitle={tepj.description} />
        </Box>
        <Box>
          <h2>Songs</h2>
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
        <Box>
          <h2>Stories</h2>
        </Box>
        <Box p={0} className="grid-cols-2">
          {songs.map((song) => (
            <Card key={song.id} href={`/stories/${song.uid}`} title={song.title} subtitle={song.description} />
          ))}
        </Box>
      </Box>
    </>
  )
}

export async function getStaticProps({ preview = false, previewData }) {
  const homepage = await getHomepage(previewData)
  const prismicSongs = await getAllSongs(previewData)
  const aboutKots = await getAboutKots()
  const aboutFHU = await getAboutFHU()
  const aboutTEPJ = await getAboutTEPJ()

  const kots = {
    title: RichText.asText(aboutKots.data.title),
    description: truncate(RichText.asText(aboutKots.data.body[0]?.primary?.text || []), {
      length: 240,
      separator: /,? +/,
    }),
  }
  const fhu = {
    title: RichText.asText(aboutFHU.data.title),
    description: truncate(RichText.asText(aboutFHU.data.body[0]?.primary?.text || []), {
      length: 240,
      separator: /,? +/,
    }),
  }
  const tepj = {
    title: RichText.asText(aboutTEPJ.data.title),
    description: truncate(RichText.asText(aboutTEPJ.data.body[1]?.primary?.text || []), {
      length: 240,
      separator: /,? +/,
    }),
  }

  const title = RichText.asText(homepage.title)

  const songs = []

  prismicSongs.forEach(({ node }) => {
    songs.push({
      id: node._meta.id,
      uid: node._meta.uid,
      title: RichText.asText(node.title),
      description: RichText.asHtml(node.description, linkResolver, htmlSerializer),
      thumbnail: {
        url: node.video.thumbnail_url,
        alt: node.video.title || title,
      },
    })
  })

  return {
    props: { preview, title, songs, kots, fhu, tepj },
  }
}
