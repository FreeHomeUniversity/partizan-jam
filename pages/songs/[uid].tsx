import * as React from 'react';
import Head from 'next/head'
import { RichText } from 'prismic-dom'

import { Box } from '../../components/Box'
import { getSong, getAllSongs } from '../../lib/api'
import { linkResolver, htmlSerializer } from '../../lib/prismic'

export default function SongsPage({ title, song, stories }) {
  console.log(song);

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box p={0}>
        <Box>
          <h1 className="text-5xl font-bold">{title}</h1>
        </Box>
        <Box>
          <div
            className="grid w-full place-center"
            dangerouslySetInnerHTML={{ __html: song.video.html }}
          />
        </Box>
        <Box p={0}>
          {stories.map(story => (
            <Box key={story.language}>
              <>
                <h3>{story.language}</h3>
                <div className="max-w-3xl text-md" dangerouslySetInnerHTML={{__html: story.text}} />
              </>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  )
}

export async function getStaticProps({ preview = false, previewData, params }) {
  const song = await getSong(params.uid, previewData)

  const title = RichText.asText(song.title)

  const stories = []

  song.story.stories.forEach((story) => {
    stories.push({
      text: RichText.asHtml(story.text, linkResolver, htmlSerializer),
      language: story.language,
    })
  });

  return {
    props: { preview, title, song, stories },
  }
}

export async function getStaticPaths() {
  const songs = await getAllSongs({})

  if (songs.length === 0) return

  return {
    paths: songs.map(({ node }) => ({
      params: { uid: node._meta.uid }
    })),
    fallback: false,
  };
}
