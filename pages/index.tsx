import * as React from 'react'
import { InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'
import { RichText } from 'prismic-dom'
import truncate from 'lodash/truncate'

import { Box } from '../components/Box'
import { Card } from '../components/Card'
import {
  getHomepage,
  getAllSongs,
  getAboutKots,
  getAboutFHU,
  getAboutTEPJ,
  getAllMusicians,
  getAllArtists,
} from '../lib/api'
import { linkResolver, htmlSerializer } from '../lib/prismic'

export async function getStaticProps({ preview = false, previewData }) {
  const homepage = await getHomepage(previewData)
  const prismicSongs = await getAllSongs(previewData)
  const prismicMusicians = await getAllMusicians(previewData)
  const prismicArtists = await getAllArtists(previewData)
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
      description: truncate(RichText.asHtml(node.description, linkResolver, htmlSerializer), {
        length: 240,
        separator: /,? +/,
      }),
      thumbnail: {
        url: node.video.thumbnail_url,
        alt: node.video.title || RichText.asText(node.title),
      },
    })
  })

  const musicians = []

  prismicMusicians.forEach(({ node }) => {
    musicians.push({
      id: node._meta.id,
      uid: node._meta.uid,
      title: RichText.asText(node.title),
      thumbnail: {
        url: node.image.url,
        alt: node.image.alt || RichText.asText(node.title),
      },
    })
  })

  const artists = []

  prismicArtists.forEach(({ node }) => {
    artists.push({
      id: node._meta.id,
      uid: node._meta.uid,
      title: RichText.asText(node.title),
      thumbnail: {
        url: node.image.url,
        alt: node.image.alt || RichText.asText(node.title),
      },
    })
  })

  return {
    props: { preview, title, songs, kots, fhu, tepj, musicians, artists },
  }
}

export default function Home({
  title,
  songs,
  kots,
  fhu,
  tepj,
  musicians,
  artists,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo title={title} />
      <>
        <Box>
          <h1>{title}</h1>
        </Box>
        <Box p={0} className="grid-cols-none md:grid-cols-3">
          <Card href={'/free-home-university'} title={fhu.title} subtitle={fhu.description} />
          <Card href={'/arkadiy-kots-band'} title={kots.title} subtitle={kots.description} />
          <Card href={'/transeuropean-partizan-jam'} title={tepj.title} subtitle={tepj.description} />
        </Box>
        <Card href="/songs" title="Songs" heading="h2" />
        <Box p={0} className="md:grid-cols-3">
          {songs.map((song) => (
            <Card
              key={song.id}
              image={song.thumbnail.url}
              alt={song.thumbnail.alt}
              href={`/songs/[uid]`}
              as={`/songs/${song.uid}`}
              title={song.title}
              subtitle={song.description}
            />
          ))}
        </Box>
        <Card href="/musicians" title="Musicians" heading="h2" />
        <Box p={0} className="md:grid-cols-4">
          {musicians.map((musician) => (
            <Card
              key={musician.id}
              image={musician.thumbnail.url}
              alt={musician.thumbnail.alt}
              href={`/musicians/[uid]`}
              as={`/musicians/${musician.uid}`}
              title={musician.title}
            />
          ))}
        </Box>
        <Card href="/artists" title="Artists" heading="h2" />
        <Box p={0} className="md:grid-cols-4">
          {artists.map((artist) => (
            <Card
              key={artist.id}
              image={artist.thumbnail.url}
              alt={artist.thumbnail.alt}
              href={`/artists/[uid]`}
              as={`/artists/${artist.uid}`}
              title={artist.title}
            />
          ))}
        </Box>{' '}
      </>
    </>
  )
}
