import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { RichText } from 'prismic-dom'

import { Box } from '../../components/Box'
import { getSong, getAllSongs } from '../../lib/api'
import { linkResolver, htmlSerializer } from '../../lib/prismic'

export default function StoryPage({ title, song, stories, description }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box p={0} className="place-stretch">
        <Box>
          <h1 className="text-5xl font-bold">{title}</h1>
        </Box>
        <Box>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </Box>
        <Box p={0} className="place-stretch">
          {stories.map((story) => (
            <Box key={story.language}>
              <>
                <h3>{story.language}</h3>
                <div
                  className="max-w-3xl text-md"
                  dangerouslySetInnerHTML={{ __html: story.text }}
                />
              </>
            </Box>
          ))}
        </Box>
        <Box>
          <h2 className="text-3xl font-black">Song</h2>
        </Box>
        <Box>
          <Link href={`/songs/${song._meta.uid}`} passHref>
            <a>
              <img src={song.video.thumbnail_url} alt={title} />
              <h3>{title}</h3>
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </a>
          </Link>
        </Box>
      </Box>
    </>
  )
}

export async function getStaticProps({ preview = false, previewData, params }) {
  const song = await getSong(params.uid, previewData)

  const title = RichText.asText(song.story.title)
  const description = RichText.asHtml(
    song.story.description,
    linkResolver,
    htmlSerializer
  )

  const stories = []

  song.story.stories.forEach((story) => {
    stories.push({
      text: RichText.asHtml(story.text, linkResolver, htmlSerializer),
      language: story.language,
    })
  })

  return {
    props: { preview, title, description, song, stories },
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
