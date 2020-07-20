import * as React from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { RichText } from 'prismic-dom'

import { Box } from '../../components/Box'
import { getAllSongs } from '../../lib/api'
import { linkResolver, htmlSerializer } from '../../lib/prismic'

export default function SongsPage({ title, songs }) {
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
        <Box p={0} className="grid-cols-3">
          {songs.map((song) => (
            <Box key={song.id}>
              <Link href={`songs/${song.uid}`} passHref>
              <a>
                <img src={song.thumbnail.url} alt={song.thumbnail.alt} />
                <h3>{song.title}</h3>
                <div dangerouslySetInnerHTML={{__html: song.description}}/>
              </a>

              </Link>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  )
}

export async function getStaticProps({ preview = false, previewData }) {
  const prismicSongs = await getAllSongs(previewData)

  const title = 'Songs'

  const songs = []

  prismicSongs.forEach(({ node }) => {
    songs.push({
      id: node._meta.id,
      uid: node._meta.uid,
      title: RichText.asText(node.title),
      description: RichText.asHtml(node.description, linkResolver, htmlSerializer),
      thumbnail: {
        url: node.video.thumbnail_url,
        alt: node.video.title || '',
      }
    })
  });


  return {
    props: { preview, title, songs },
  }
}
