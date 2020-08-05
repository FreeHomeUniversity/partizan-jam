import * as React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Box from '../components/Box'

export default function NotFound() {
  const router = useRouter()
  React.useEffect(() => {
    router.replace('/')
  }, [])

  return (
    <Box className="place-center">
      <Link href="/" passHref>
        <a className="backlink">Page Not Found</a>
      </Link>
    </Box>
  )
}
