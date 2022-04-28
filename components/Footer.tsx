import * as React from 'react'
import dynamic from 'next/dynamic'

import Box from './Box'
import Card from './Card'

const LINKS = [
  {
    href: '/free-home-university',
    title: 'About FHU',
  },
  {
    href: '/arkadiy-kots-band',
    title: 'About Arkadiy',
  },
  {
    href: '/transeuropean-partizan-jam',
    title: 'About Jam',
  },
  {
    href: '/songs',
    title: 'Songs',
  },
  {
    href: '/musicians',
    title: 'Musicians',
  },
  {
    href: '/artists',
    title: 'Artists',
  },
]

const Footer: React.FC = () => {
  return (
    <footer className="grid content-end">
      <nav>
        <ul className="grid grid-cols-3">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Card href={link.href} title={link.title} heading="h2" />
            </li>
          ))}
        </ul>
      </nav>
      <Box>
        <h2 className="text-center">
          <a href="https://www.fhu.art/" target="_blank" rel="noreferrer">
            FHU Site
          </a>
        </h2>
      </Box>
      <Box p={2}>
        <a
          className="font-bold text-center uppercase text-xxs"
          href="https://beta.accio.pro/"
          target="_blank"
          rel="noreferrer"
        >
          made by accio
        </a>
      </Box>
    </footer>
  )
}

export default Footer
