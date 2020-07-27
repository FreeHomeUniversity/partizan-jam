import * as React from 'react'

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
]

type FooterProps = {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <Box p={0} className="items-end">
      <footer>
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
    </Box>
  )
}

export default Footer
