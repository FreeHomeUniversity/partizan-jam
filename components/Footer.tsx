import * as React from 'react'
import dynamic from 'next/dynamic'

import Card from './Card'
const Playlist = dynamic(() => import('./Playlist'))

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
      <Playlist />
      <nav>
        <ul className="grid grid-cols-3">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Card href={link.href} title={link.title} heading="h2" />
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  )
}

export default Footer
