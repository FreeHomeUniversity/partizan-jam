import * as React from 'react'
import Link from 'next/link'
import styled from '@emotion/styled'

import { Box } from './Box'
import { Image } from './Image'

export type Props = {
  title: string
  heading?: 'h1' | 'h2' | 'h3' | 'h4'
  href?: string
  as?: string
  image?: string
  alt?: string
  subtitle?: string
  className?: string
}

const StyledHeading = styled.div``

export const Content: React.FC<Partial<Props>> = ({ image, alt, title, subtitle, heading = 'h3', className = '' }) => {
  const Heading = StyledHeading.withComponent(heading)

  return (
    <Box className={`w-full h-full space-y-4 ${className}`}>
      {image && <Image className="w-full" src={image} alt={alt} />}
      <Heading>{title}</Heading>
      {subtitle && <div dangerouslySetInnerHTML={{ __html: subtitle }} />}
    </Box>
  )
}

export const Card: React.FC<Props> = ({ href, as, ...props }) => {
  return href ? (
    <Link href={href} as={as} passHref>
      <a>
        <Content
          {...props}
          className="transition-colors duration-300 ease-out hover:bg-theme-blue-600 hover:text-white"
        />
      </a>
    </Link>
  ) : (
    <Content {...props} />
  )
}

export default React.memo(Card)
