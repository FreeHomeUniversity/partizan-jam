import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { RichText } from 'prismic-dom'
import { truncate } from 'lodash'

import { Box } from '../components/Box'
import {
  getHomepage,
  getAllSongs,
  getAboutKots,
  getAboutFHU,
  getAboutTEPJ,
} from '../lib/api'
import { linkResolver, htmlSerializer } from '../lib/prismic'

export default function Home({ title, songs, kots, fhu, tepj }) {
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
          <Box>
            <Link href={'/free-home-university'} passHref>
              <a>
                <h3 className="text-xl font-bold">{fhu.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: fhu.description }} />
              </a>
            </Link>
          </Box>
          <Box>
            <Link href={'/arkadiy-kots-band'} passHref>
              <a>
                <h3 className="text-xl font-bold">{kots.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: kots.description }} />
              </a>
            </Link>
          </Box>
          <Box>
            <Link href={'/transeuropean-partizan-jam'} passHref>
              <a>
                <h3 className="text-xl font-bold">{tepj.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: tepj.description }} />
              </a>
            </Link>
          </Box>
        </Box>
        <Box>
          <h2 className="text-3xl font-black">Songs</h2>
        </Box>
        <Box p={0} className="grid-cols-3">
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
        <Box>
          <h2 className="text-3xl font-black">Stories</h2>
        </Box>
        <Box p={0} className="grid-cols-2">
          {songs.map((song) => (
            <Box key={song.id}>
              <Link href={`/stories/${song.uid}`} passHref>
                <a>
                  <h3>{song.title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: song.description }} />
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
  const homepage = await getHomepage(previewData)
  const prismicSongs = await getAllSongs(previewData)
  const aboutKots = await getAboutKots()
  const aboutFHU = await getAboutFHU()
  const aboutTEPJ = await getAboutTEPJ()

  const kots = {
    title: RichText.asText(aboutKots.data.title),
    description: truncate(
      RichText.asText(aboutKots.data.body[0]?.primary?.text || []),
      {
        length: 240,
        separator: /,? +/,
      }
    ),
  }
  const fhu = {
    title: RichText.asText(aboutFHU.data.title),
    description: truncate(
      RichText.asText(aboutFHU.data.body[0]?.primary?.text || []),
      {
        length: 240,
        separator: /,? +/,
      }
    ),
  }
  const tepj = {
    title: RichText.asText(aboutTEPJ.data.title),
    description: truncate(
      RichText.asText(aboutTEPJ.data.body[1]?.primary?.text || []),
      {
        length: 240,
        separator: /,? +/,
      }
    ),
  }

  const title = RichText.asText(homepage.title)

  const songs = []

  prismicSongs.forEach(({ node }) => {
    songs.push({
      id: node._meta.id,
      uid: node._meta.uid,
      title: RichText.asText(node.title),
      description: RichText.asHtml(
        node.description,
        linkResolver,
        htmlSerializer
      ),
      thumbnail: {
        url: node.video.thumbnail_url,
        alt: node.video.title || '',
      },
    })
  })

  return {
    props: { preview, title, songs, kots, fhu, tepj },
  }
}
