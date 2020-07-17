import * as React from 'react'
import Link from 'next/link'

import Box from './Box'

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
    <Box p={0}>
      <footer>
        <nav>
          <ul className="grid grid-cols-3">
            {LINKS.map((link) => (
              <Box key={link.href}>
                <li className="font-bold">
                  <Link href={link.href} passHref>
                    <a>{link.title}</a>
                  </Link>
                </li>
              </Box>
            ))}
          </ul>
        </nav>
      </footer>
    </Box>
  )
}

export default Footer
