import * as React from 'react'
import Head from 'next/head'
import { RichText } from 'prismic-dom'
import Link from 'next/link'
import { css } from '@emotion/react'

import { Box } from '../../components/Box'
import { Tabs } from '../../components/Tabs'
import { YouTube } from '../../components/YouTube'
import { getSong, getAllSongs } from '../../lib/api'
import { linkResolver, htmlSerializer } from '../../lib/prismic'

export default function SongPage({ title, song, stories, songs }) {
  // console.log(song)

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box p={0} className="place-stretch">
        <Box className="place-stretch">
          <YouTube
            youTubeId={song.video.embed_url.replace('https://youtu.be/', '')}
            // autoPlay
          />
        </Box>
        <div
          className="grid"
          css={css`
            grid-template-columns: 2fr 1fr;
          `}
        >
          <Tabs title={title} buttons={stories.map((x) => x.language)} tabs={stories.map((x) => x.text)} />
          <Box p={0} className="place-start">
            <Box>
              <h3 className="text-2xl font-bold">Songs</h3>
            </Box>
            <Box p={0} className="grid-cols-2 place-start">
              {songs.map((song) => (
                <Box key={song.id}>
                  <Link href={`/songs/${song.uid}`} passHref>
                    <a>
                      <img src={song.thumbnail.url} alt={song.thumbnail.alt} />
                      <h3>{song.title}</h3>
                      <div dangerouslySetInnerHTML={{ __html: song.description }} />
                    </a>
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>
        </div>
      </Box>
    </>
  )
}

export async function getStaticProps({ preview = false, previewData, params }) {
  const song = await getSong(params.uid, previewData)
  const prismicSongs = await getAllSongs(previewData)
  const songs = []

  prismicSongs.forEach(({ node }) => {
    if (node._meta.uid !== params.uid) {
      songs.push({
        id: node._meta.id,
        uid: node._meta.uid,
        title: RichText.asText(node.title),
        description: RichText.asHtml(node.description, linkResolver, htmlSerializer),
        thumbnail: {
          url: node.video.thumbnail_url,
          alt: node.video.title || '',
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

  return {
    props: { preview, title, song, stories, songs },
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
