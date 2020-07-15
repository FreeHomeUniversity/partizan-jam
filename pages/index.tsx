import Head from 'next/head'
import { css } from '@emotion/react'
import tw from '@tailwindcssinjs/macro'

const hoverStyles = css`
  ${tw`text-5xl`};
  color: blue;
`

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Poop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="italic" css={hoverStyles}>Poop</h1>
    </div>
  )
}
