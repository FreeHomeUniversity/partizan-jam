import * as React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import create from 'zustand'

import Box from '../components/Box'
import Footer from '../components/Footer'
import Logo from '../components/Logo'

import '../styles/fonts.css'
import '../styles/base.css'

type State = {
  black: boolean
  toggle: () => void

  outline: number
  fade: () => void
}

const [useTheme] = create<State>((set) => ({
  black: false,
  toggle: () => set((state) => ({ black: !state.black })),
  outline: 100,
  fade: () => set((state) => ({ outline: state.outline > 0 ? state.outline - 1 : 0 })),
}))

const dinamicProps = (props) => css`
  --color: ${props.blackTheme ? `rgba(255, 255, 255, 1)` : `rgba(0, 0, 0, 1)`};
  --backgound-color: ${props.blackTheme ? `rgba(0, 0, 0, 1)` : `rgba(255, 255, 255, 1)`};
  --outline-color: rgba(151, 151, 151, ${props.outline / 100});
`

const Wrapper = styled.div`
  ${dinamicProps};
`

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
    <Wrapper className="p-2 md:p-4 theme" blackTheme={blackTheme} outline={outline}>
      <Head>
        <title>TransEuropean Partizan Jam</title>
      </Head>
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
        <Box p={0}>
          <Component {...pageProps} />
          <Footer />
        </Box>
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
    </Wrapper>
  )
}
