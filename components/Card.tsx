import * as React from 'react'
import Link from 'next/link'

import { Box } from './Box'
import { Image } from './Image'

export type Props = {
  title: string
  href?: string
  image?: string
  alt?: string
  subtitle?: string
}

export const Content: React.FC<Omit<Props, 'href'>> = ({
  image,
  alt,
  title,
  subtitle,
}) => {
  return (
    <Box className="w-full h-full space-y-4">
      {image && <Image src={image} alt={alt} />}
      <h3 className="text-2xl font-bold">{title}</h3>
      {subtitle && <div dangerouslySetInnerHTML={{ __html: subtitle }} />}
    </Box>
  )
}

export const Card: React.FC<Props> = ({ href, ...props }) => {
  return href ? (
    <Link href={href} passHref>
      <a>
        <Content {...props} />
      </a>
    </Link>
  ) : (
    <Content {...props} />
  )
}

export default React.memo(Card)
