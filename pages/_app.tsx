import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { css } from '@emotion/react'
import create from 'zustand'

import Box from '../components/Box'
import Footer from '../components/Footer'
import Logo from '../components/Logo'

import '../styles/base.css'

const [useTheme] = create((set) => ({
  black: false,
  toggle: () => set((state) => ({ black: !state.black })),
}))

export default function MyApp({ Component, pageProps }) {
  const blackTheme = useTheme((state) => state.black)
  const toggleTheme = useTheme((state) => state.toggle)

  React.useEffect(() => {
    if (document !== undefined) {
      document.addEventListener('click', toggleTheme)
    }

    return () => {
      document.removeEventListener('click', toggleTheme)
    }
  }, [])

  return (
    <div
      className="p-4 theme"
      css={css`
        --color: ${blackTheme ? `rgba(255, 255, 255, 1)` : `rgba(0, 0, 0, 1)`};
        --backgound-color: ${blackTheme
          ? `rgba(0, 0, 0, 1)`
          : `rgba(255, 255, 255, 1)`};
      `}
    >
      <Head>
        <title>TransEuropean Partizan Jam</title>
      </Head>
      <div
        className="grid"
        css={css`
          grid-template-columns: 3.75rem 1fr 3.75rem;
        `}
      >
        <Box p={0} className="place-start">
          <Box className="sticky top-0 h-screen-4">
            <Link href="/" passHref>
              <a className="theme hover:text-red-600">
                <Logo />
              </a>
            </Link>
          </Box>
        </Box>
        <Box p={0} className="place-stretch">
          <Component {...pageProps} />
          <Footer />
        </Box>
        <Box p={0} className="place-start">
          <Box className="sticky top-0 h-screen-4">
            <Link href="/" passHref>
              <a className="theme hover:text-red-600">
                <Logo className="transform rotate-180" />
              </a>
            </Link>
          </Box>
        </Box>
      </div>
    </div>
  )
}
