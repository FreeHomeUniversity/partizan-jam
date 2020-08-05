import * as React from 'react'
import { InferGetStaticPropsType } from 'next'
import { RichText } from 'prismic-dom'
import { css } from '@emotion/react'
import truncate from 'lodash/truncate'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { Slides } from '../../components/Slides'
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
  const description = RichText.asHtml(song.description, linkResolver, htmlSerializer)

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
      artworks: song.artist.body.map(({ primary, fields }) => ({
        title: RichText.asText(primary.artwork_title),
        description: RichText.asHtml(primary.artwork_description, linkResolver, htmlSerializer),
        thumbnail: {
          url: primary.artwork_image.url,
          alt: primary.artwork_image.alt || RichText.asText(primary.artwork_title),
        },
        slides: fields.map((slide) => ({
          url: slide.artwork_slider_image.url,
          alt: slide.artwork_slider_image.alt || '',
        })),
      })),
    })
  }

  return {
    props: { preview, title, description, song, stories, songs, musicians, artists, uid: params.uid },
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
  description,
  song,
  stories,
  songs,
  musicians,
  artists,
  uid,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          url: `https://partisan-jam.fhu.art/songs/${uid}`,
          title: title,
          description: description,
        }}
      />
      <Box p={0} className="place-start">
        <Box>
          <Link href="/songs" passHref>
            <a className="backlink">← Songs</a>
          </Link>
        </Box>
        <Box>
          <YouTube
            youTubeId={song.video.embed_url.replace('https://youtu.be/', '')}
            // autoPlay
          />
        </Box>
        <div
          className="grid w-full"
          css={css`
            grid-template-areas: 'a' 'b' 'c';
            @media (min-width: 768px) {
              grid-template-areas: 'a a c' 'b b b';
            }
          `}
        >
          <div
            css={css`
              grid-area: a;
            `}
          >
            <Tabs title={title} buttons={stories.map((x) => x.language)} tabs={stories.map((x) => x.text)} />
          </div>
          <div
            css={css`
              grid-area: c;
            `}
          >
            <Box>
              <h2>More Songs</h2>
            </Box>
            <Box p={0} className="lg:grid-cols-2">
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
          <div
            css={css`
              grid-area: b;
            `}
          >
            <Box>
              <h2>Musicians</h2>
            </Box>
            <Box p={0} className="md:grid-cols-3">
              {musicians.map((musician) => (
                <Card
                  key={musician.id}
                  href={`/musicians/[uid]`}
                  as={`/musicians/${musician.uid}`}
                  title={musician.title}
                />
              ))}
            </Box>
            {artists.length > 0 && (
              <>
                <Box>
                  <h2>Artist</h2>
                </Box>
                <Box p={0}>
                  {artists.map((artist) => (
                    <React.Fragment key={artist.id}>
                      <Card
                        image={artist.thumbnail.url}
                        alt={artist.thumbnail.alt}
                        href={`/artists/[uid]`}
                        as={`/artists/${artist.uid}`}
                        title={artist.title}
                        subtitle={artist.description}
                        slot={
                          artist.artworks[0] ? (
                            <Card
                              image={artist.artworks[0].thumbnail.url}
                              alt={artist.artworks[0].thumbnail.alt}
                              title={artist.artworks[0].title}
                              subtitle={artist.artworks[0].description}
                              slot={<Slides slides={artist.artworks[0].slides} />}
                              isChild
                            />
                          ) : null
                        }
                      />
                    </React.Fragment>
                  ))}
                </Box>
              </>
            )}
          </div>
        </div>
      </Box>
    </>
  )
}
