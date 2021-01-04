import * as React from 'react'
import { RichText } from 'prismic-dom'
import { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

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
  const descriptionAsText = RichText.asText(musician.description)

  const image = {
    url: musician.image?.url || null,
    alt: musician.image?.alt || RichText.asText(musician.title),
  }

  prismicSongs.forEach(({ node }) => {
    if ((node.musicians || []).some((x) => x.musician?._meta?.uid === params.uid)) {
      songs.push({
        id: node._meta.id,
        uid: node._meta.uid,
        title: node.title ? RichText.asText(node.title) : null,
        description: node.description ? RichText.asHtml(node.description, linkResolver, htmlSerializer) : null,
        thumbnail: {
          url: node.video.thumbnail_url,
          alt: node.video.title || node.title ? RichText.asText(node.title) : null,
        },
      })
    }
  })

  return {
    props: { preview, title, description, descriptionAsText, image, songs, uid: params.uid },
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
  descriptionAsText,
  songs,
  uid,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title={title}
        description={descriptionAsText}
        openGraph={{
          url: `https://partisan-jam.fhu.art/misicians/${uid}`,
          title: title,
          description: descriptionAsText,
        }}
      />
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
