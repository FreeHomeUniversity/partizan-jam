import * as React from 'react'
import { RichText } from 'prismic-dom'
import { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { getArtist, getAllArtists, getAllSongs } from '../../lib/api'
import { linkResolver, htmlSerializer } from '../../lib/prismic'
import { Image } from '../../components/Image'
import Slides from '../../components/Slides'

export async function getStaticProps({ preview = false, previewData, params }) {
  const artist = await getArtist(params.uid, previewData)
  const prismicSongs = await getAllSongs(previewData)

  const title = artist.title ? RichText.asText(artist.title || []) : null
  const description = RichText.asHtml(artist.description || [], linkResolver, htmlSerializer)
  const descriptionAsText = RichText.asText(artist.description || [])
  const image = {
    url: artist.image?.url || null,
    alt: artist.image?.alt || RichText.asText(artist.title || []),
  }
  const artworks = (artist.body || []).map(({ primary, fields }) => ({
    title: primary.artwork_title ? RichText.asText(primary.artwork_title || []) : null,
    description: primary.artwork_description
      ? RichText.asHtml(primary.artwork_description || [], linkResolver, htmlSerializer)
      : null,
    thumbnail: primary.artwork_image
      ? {
          url: primary.artwork_image?.url || null,
          alt: primary.artwork_image?.alt || primary.artwork_title ? RichText.asText(primary.artwork_title || []) : null,
        }
      : null,
    slides: (fields || []).map((slide) =>
      slide.artwork_slider_image
        ? {
            url: slide.artwork_slider_image?.url || null,
            alt: slide.artwork_slider_image?.alt || '',
            caption: slide.artwork_slider_description
              ? RichText.asHtml(slide.artwork_slider_description || [], linkResolver, htmlSerializer)
              : null,
          }
        : null,
    ),
  }))

  const songs = []
  prismicSongs.forEach(({ node }) => {
    if (node.artist?._meta?.uid === params.uid) {
      songs.push({
        id: node._meta.id,
        uid: node._meta.uid,
        title: node.title ? RichText.asText(node.title || []) : null,
        description: node.description ? RichText.asHtml(node.description || [], linkResolver, htmlSerializer) : null,
        thumbnail: {
          url: node.video.thumbnail_url,
          alt: node.video.title || node.title ? RichText.asText(node.title || []) : null,
        },
      })
    }
  })

  return {
    props: { preview, title, description, descriptionAsText, image, artworks, songs, uid: params.uid },
  }
}

export async function getStaticPaths() {
  const artists = await getAllArtists({})

  if (artists.length === 0) return

  return {
    paths: artists.map(({ node }) => ({
      params: { uid: node._meta.uid },
    })),
    fallback: false,
  }
}

export default function ArtistPage({
  title,
  description,
  descriptionAsText,
  image,
  artworks,
  songs,
  uid,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title={title}
        description={descriptionAsText}
        openGraph={{
          url: `https://partisan-jam.fhu.art/artists/${uid}`,
          title: title,
          description: descriptionAsText,
        }}
      />
      <div className="grid place-start">
        <Box>
          <Link href="/artists" passHref>
            <a className="backlink">← Artists</a>
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
        {artworks[0] ? (
          <Card
            image={artworks[0].thumbnail.url}
            alt={artworks[0].thumbnail.alt}
            title={artworks[0].title}
            subtitle={artworks[0].description}
            slot={<Slides slides={artworks[0].slides} />}
          />
        ) : null}
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
