import * as React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import { css } from '@emotion/react'
import create from 'zustand'
import { DefaultSeo } from 'next-seo'

import Box from '../components/Box'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import persist from '../lib/persist'
import SEO from '../next-seo.config'

import '../styles/fonts.css'
import '../styles/base.css'
import dynamic from 'next/dynamic'

const Playlist = dynamic(() => import('../components/Playlist'))

type State = {
  black: boolean
  toggle: () => void

  outline: number
  fade: () => void
}

const useTheme = create<State>(
  persist(
    (set) => ({
      black: false,
      toggle: () => set((state) => ({ black: !state.black })),
      outline: 127,
      fade: () => set((state) => ({ outline: state.outline > 0 ? state.outline - 5 : 0 })),
    }),
    'theme',
  ),
)

export default function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  const blackTheme = useTheme((state) => state.black)
  const toggleTheme = useTheme((state) => state.toggle)
  const outline = useTheme((state) => state.outline)
  const fade = useTheme((state) => state.fade)

  React.useEffect(() => {
    if (document !== undefined) {
      document.addEventListener('click', toggleTheme)
      document.addEventListener('click', fade)
    }

    return () => {
      document.removeEventListener('click', toggleTheme)
      document.removeEventListener('click', fade)
    }
  }, [])

  return (
    <div
      className="px-2 md:p-4 theme"
      css={css`
        min-height: -webkit-fill-available;
        min-height: 100vh;
        --color: ${blackTheme ? `rgba(255, 255, 255, 1)` : `rgba(0, 0, 0, 1)`};
        --backgound-color: ${blackTheme ? `rgba(0, 0, 0, 1)` : `rgba(255, 255, 255, 1)`};
        --outline-color: rgb(
          ${blackTheme ? 0 + outline : 255 - outline},
          ${blackTheme ? 0 + outline : 255 - outline},
          ${blackTheme ? 0 + outline : 255 - outline}
        );
      `}
    >
      <DefaultSeo {...SEO} />
      <div
        className="grid"
        css={css`
          grid-template-columns: 2.5rem 1fr;
          @media (min-width: 768px) {
            grid-template-columns: 3.75rem 1fr 3.75rem;
          }
        `}
      >
        <Box p={0} className="md:place-start">
          <Box className="sticky top-0 overflow-hidden h-screen-4 theme">
            <Link href="/" passHref>
              <a className="theme hover:text-theme-red-600">
                <Logo />
              </a>
            </Link>
          </Box>
        </Box>
        <div className="grid place-stretch">
          <Playlist />
          <Component {...pageProps} />
          <Footer />
        </div>
        <Box p={0} className="hidden md:grid md:place-start">
          <Box className="sticky top-0 h-10 overflow-hidden md:h-screen-4 theme">
            <Link href="/" passHref>
              <a className="theme hover:text-theme-red-600">
                <Logo className="transform rotate-90 md:rotate-180" />
              </a>
            </Link>
          </Box>
        </Box>
      </div>
    </div>
  )
}
