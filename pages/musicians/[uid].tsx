import * as React from 'react'
import Head from 'next/head'
import { RichText } from 'prismic-dom'
import { InferGetStaticPropsType } from 'next'
import Link from 'next/link'

import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { getMusician, getAllMusicians, getAllSongs } from '../../lib/api'
import { linkResolver, htmlSerializer } from '../../lib/prismic'
import { Image } from '../../components/Image'

export async function getStaticProps({ preview = false, previewData, params }) {
  const musician = await getMusician(params.uid, previewData)
  const prismicSongs = await getAllSongs(previewData)

  const songs = []

  const title = RichText.asText(musician.title)
  const description = RichText.asHtml(musician.description, linkResolver, htmlSerializer)

  const image = {
    url: musician.image.url,
    alt: musician.image.alt || RichText.asText(musician.title),
  }

  prismicSongs.forEach(({ node }) => {
    if ((node.musicians || []).some((x) => x.musician?._meta?.uid === params.uid)) {
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

  return {
    props: { preview, title, description, image, songs },
  }
}

export async function getStaticPaths() {
  const prismicMusicians = await getAllMusicians({})

  if (prismicMusicians.length === 0) return

  return {
    paths: prismicMusicians.map(({ node }) => ({
      params: { uid: node._meta.uid },
    })),
    fallback: false,
  }
}

export default function StoryPage({
  title,
  image,
  description,
  songs,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid place-start">
        <Box>
          <Link href="/musicians" passHref>
            <a className="backlink">← Musicians</a>
          </Link>
        </Box>
        <Box>
          <Image src={image.url} alt={image.alt} />
        </Box>
        <Box>
          <h1>{title}</h1>
        </Box>
        <Box>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </Box>
        <Box>
          <h2>Songs</h2>
        </Box>
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
      </div>
    </>
  )
}
