import Head from 'next/head'
import { css } from '@emotion/react'
import tw from '@tailwindcssinjs/macro'
import { RichText } from 'prismic-dom'

import { getHomepage } from '../lib/api'

const hoverStyles = css`
  ${tw`text-5xl`};
  color: blue;
`

export default function Home({ title }) {
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="italic" css={hoverStyles}>
        {title}
      </h1>
    </div>
  )
}

export async function getStaticProps({ preview = false, previewData }) {
  const homepage = await getHomepage(previewData)
  
  const title = RichText.asText(homepage.title)

  return {
    props: { preview, title },
  }
}
