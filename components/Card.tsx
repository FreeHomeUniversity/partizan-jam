import * as React from 'react'
import Link from 'next/link'
import styled from '@emotion/styled'

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
  slot?: React.ReactNode | null
  isChild?: boolean
}

const StyledHeading = styled.div``

export const Content: React.FC<Partial<Props>> = ({
  image,
  alt,
  title,
  subtitle,
  slot,
  isChild,
  heading = 'h3',
  className = '',
}) => {
  const Heading = StyledHeading.withComponent(heading)

  return (
    <div className={`w-full h-full ${isChild ? 'p-0' : 'theme-outline p-2 md:p-4'} ${className}`}>
      <div className={`${slot ? `grid gap-2 md:gap-4 ${!isChild && 'md:grid-cols-2'}` : ''}`}>
        <div className="space-y-4">
          {image && <Image className="w-full" src={image} alt={alt} />}
          <Heading>{title}</Heading>
          {subtitle && <div dangerouslySetInnerHTML={{ __html: subtitle }} />}
        </div>
        <div>{slot ? slot : null}</div>
      </div>
    </div>
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
