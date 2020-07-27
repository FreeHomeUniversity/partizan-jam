import * as React from 'react'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { RichText } from 'prismic-dom'

import { Box } from '../../components/Box'
import { Card } from '../../components/Card'
import { getAllMusicians } from '../../lib/api'
import { linkResolver, htmlSerializer } from '../../lib/prismic'

export async function getStaticProps({ preview = false, previewData }) {
  const prismicMusicians = await getAllMusicians(previewData)

  const title = 'Musicians'

  const musicians = []

  prismicMusicians.forEach(({ node }) => {
    musicians.push({
      id: node._meta.id,
      uid: node._meta.uid,
      title: RichText.asText(node.title),
      description: RichText.asHtml(node.description, linkResolver, htmlSerializer),
    })
  })

  return {
    props: { preview, title, musicians },
  }
}

export default function StoriesPage({ title, musicians }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box p={0} className="place-start">
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
      </Box>
    </>
  )
}
