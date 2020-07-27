import * as React from 'react'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { RichText } from 'prismic-dom'
import { css } from '@emotion/react'
import { truncate } from 'lodash'

import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { Tabs } from '../../components/Tabs'
import { YouTube } from '../../components/YouTube'
import { getSong, getAllSongs } from '../../lib/api'
import { linkResolver, htmlSerializer } from '../../lib/prismic'

export async function getStaticProps({ preview = false, previewData, params }) {
  const song = await getSong(params.uid, previewData)
  const prismicSongs = await getAllSongs(previewData)
  const songs = []
  const musicians = []
  const artists = []

  prismicSongs.forEach(({ node }) => {
    if (node._meta.uid !== params.uid) {
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
    }
  })

  const title = RichText.asText(song.title)

  const stories = []

  song.story.stories.forEach((story) => {
    stories.push({
      text: RichText.asHtml(story.text, linkResolver, htmlSerializer),
      language: story.language,
    })
  })

  song.musicians.forEach(({ musician }) => {
    musicians.push({
      id: musician._meta.id,
      uid: musician._meta.uid,
      title: RichText.asText(musician.title),
      description: RichText.asHtml(musician.description, linkResolver, htmlSerializer),
      thumbnail: {
        url: musician.image.url,
        alt: musician.image.alt || RichText.asText(musician.title),
      },
    })
  })

  if (song.artist) {
    artists.push({
      id: song.artist._meta.id,
      uid: song.artist._meta.uid,
      title: RichText.asText(song.artist.title),
      description: truncate(RichText.asText(song.artist.description || []), {
        length: 240,
        separator: /,? +/,
      }),
      thumbnail: {
        url: song.artist.image.url,
        alt: song.artist.image.alt || RichText.asText(song.artist.title),
      },
      // artworks: song.artist.body.reduce((res, { primary, fields }) => {
      //   if (primary) {
      //     res = {
      //       ...res,
      //       title: RichText.asText(primary.artwork_title),
      //       description: RichText.asHtml(primary.artwork_description, linkResolver, htmlSerializer),
      //       thumbnail: {
      //         url: primary.artwork_image.url,
      //         alt: primary.artwork_image.alt || RichText.asText(primary.artwork_title),
      //       },
      //     }
      //   }
      //   if (fields) {
      //     res = {
      //       ...res,
      //       slides: fields.map((slide) => ({
      //         url: slide.artwork_slider_image.url,
      //         alt: slide.artwork_slider_image.alt || '',
      //         caption: slide.artwork_slider_description
      //           ? RichText.asHtml(slide.artwork_slider_description, linkResolver, htmlSerializer)
      //           : null,
      //       })),
      //     }
      //   }
      // }, {}),
    })
  }

  return {
    props: { preview, title, song, stories, songs, musicians, artists },
  }
}

export async function getStaticPaths() {
  const songs = await getAllSongs({})

  if (songs.length === 0) return

  return {
    paths: songs.map(({ node }) => ({
      params: { uid: node._meta.uid },
    })),
    fallback: false,
  }
}

export default function SongPage({
  title,
  song,
  stories,
  songs,
  musicians,
  artists,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box p={0}>
        <Box>
          <YouTube
            youTubeId={song.video.embed_url.replace('https://youtu.be/', '')}
            // autoPlay
          />
        </Box>
        <div
          className="grid grid-te"
          css={css`
            @media (min-width: 768px) {
              grid-template-columns: 2fr 1fr;
            }
          `}
        >
          <Tabs title={title} buttons={stories.map((x) => x.language)} tabs={stories.map((x) => x.text)} />
          <Box p={0} className="place-start">
            <Box>
              <h2>Songs</h2>
            </Box>
            <Box p={0} className="lg:grid-cols-2">
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
          </Box>
        </div>
        <Box>
          <h2>Musicians</h2>
        </Box>
        <Box p={0} className="md:grid-cols-3">
          {musicians.map((musician) => (
            <Card key={musician.id} href={`/musicians/${musician.uid}`} title={musician.title} />
          ))}
        </Box>
        {artists.length > 0 && (
          <>
            <Box>
              <h2>Artist</h2>
            </Box>
            <Box p={0}>
              {artists.map((artist) => (
                <Card
                  key={artist.id}
                  image={artist.thumbnail.url}
                  alt={artist.thumbnail.alt}
                  href={`/artists/${artist.uid}`}
                  title={artist.title}
                  subtitle={artist.description}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </>
  )
}