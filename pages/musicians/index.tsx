import * as React from 'react'
import { InferGetStaticPropsType } from 'next'
import { RichText } from 'prismic-dom'
import truncate from 'lodash/truncate'
import { NextSeo } from 'next-seo'

import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { getAllMusicians } from '../../lib/api'

export async function getStaticProps({ preview = false, previewData }) {
  const prismicMusicians = await getAllMusicians(previewData)

  const title = 'Musicians'

  const musicians = []

  prismicMusicians.forEach(({ node }) => {
    musicians.push({
      id: node._meta.id,
      uid: node._meta.uid,
      title: RichText.asText(node.title || []),
      description: truncate(RichText.asText(node.description || []), {
        length: 240,
        separator: /,? +/,
      }),
      thumbnail: {
        url: node.image?.url || null,
        alt: node.image?.alt || RichText.asText(node.title || []),
      },
    })
  })

  return {
    props: { preview, title, musicians },
  }
}

export default function StoriesPage({ title, musicians }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title={title}
        openGraph={{
          url: `https://partisan-jam.fhu.art/musicians`,
          title: title,
        }}
      />
      <>
        <Box>
          <h1>{title}</h1>
        </Box>
        <Box p={0} className="grid-cols-2">
          {musicians.map((musician) => (
            <Card
              key={musician.id}
              image={musician.thumbnail.url}
              alt={musician.thumbnail.alt}
              href={`/musicians/[uid]`}
              as={`/musicians/${musician.uid}`}
              title={musician.title}
              subtitle={musician.description}
            />
          ))}
        </Box>
      </>
    </>
  )
}
