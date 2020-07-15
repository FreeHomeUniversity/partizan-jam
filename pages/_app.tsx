import Head from 'next/head'
import '../styles/base.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <div
      // onClick={(e) =>
      //   e.target.setAttribute(
      //     'style',
      //     `
      //   --backgound-color: rgba(0, 0, 0, 1);
      //   --color: rgba(255, 255, 255, 1);
      // `
      //   )
      // }
    >
      <Head>
        <title>Tailwindcss Emotion Example</title>
      </Head>
      <Component {...pageProps} />
    </div>
  )
}
