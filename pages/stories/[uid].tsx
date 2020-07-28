import * as React from 'react'
import Head from 'next/head'
import { RichText } from 'prismic-dom'
import { css } from '@emotion/react'
import { InferGetStaticPropsType } from 'next'

import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { getSong, getAllSongs } from '../../lib/api'
import { linkResolver, htmlSerializer } from '../../lib/prismic'

export async function getStaticProps({ preview = false, previewData, params }) {
  const song = await getSong(params.uid, previewData)

  const title = RichText.asText(song.story.title)
  const description = RichText.asHtml(song.story.description, linkResolver, htmlSerializer)

  const stories = []

  song.story.stories.forEach((story) => {
    if (story.text) {
      stories.push({
        text: RichText.asHtml(story.text, linkResolver, htmlSerializer),
        language: story.language,
      })
    }
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

export default function StoryPage({
  title,
  song,
  stories,
  description,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box p={0} className="place-stretch">
        <Box>
          <h1>{title}</h1>
        </Box>
        <Box>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </Box>
        <Box p={0} className="place-stretch">
          {stories.map((story) => (
            <Box p={0} key={story.language}>
              <>
                <Box>
                  <h2>{story.language}</h2>
                </Box>
                <Box className="place-center">
                  <div
                    className="prose"
                    css={css`
                      @media (min-width: 768px) {
                        font-size: 1.125rem;
                        line-height: 1.7777778;
                      }
                      @media (min-width: 1024px) {
                        font-size: 1.25rem;
                        line-height: 1.8;
                      }
                    `}
                    dangerouslySetInnerHTML={{ __html: story.text }}
                  />
                </Box>
              </>
            </Box>
          ))}
        </Box>
        <Box>
          <h2 className="text-3xl font-black">Song</h2>
        </Box>
        <Card
          key={song.id}
          image={song.video.thumbnail_url}
          alt={title}
          href={`/songs/[uid]`}
          as={`/songs/${song._meta.uid}`}
          title={title}
          subtitle={description}
        />
      </Box>
    </>
  )
}
