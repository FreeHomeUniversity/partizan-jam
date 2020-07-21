import * as React from 'react'
import { css } from '@emotion/react'

export type ImageProps = {
  src: string
  alt?: string
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2' | '8:5'
}

const RATIOS = {
  '1:1': '100%',
  '16:9': '56.25%',
  '4:3': '75%',
  '3:2': '66.66%',
  '8.5': '62.5%',
}
export const Image: React.FC<ImageProps> = ({
  src,
  alt = '',
  aspectRatio = '4:3',
}) => {
  const srcSet = []

  if (src.includes('prismic')) {
    const [w, h] = aspectRatio.split(':')
    const ratio = parseInt(h) / parseInt(w)
    srcSet.push(`${src}&amp;fit=max&amp;w=1920&amp;h=${1920 * ratio} 1920w`)
    srcSet.push(`${src}&amp;fit=max&amp;w=3840&amp;h=${3840 * ratio} 3840w`)
    srcSet.push(`${src}&amp;fit=max&amp;w=2880&amp;h=${2880 * ratio} 2880w`)
    srcSet.push(`${src}&amp;fit=max&amp;w=960&amp;h=${960 * ratio} 960w`)
    srcSet.push(`${src}&amp;fit=max&amp;w=480&amp;h=${480 * ratio} 480w`)
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className="w-full"
        css={css`
          padding-bottom: ${RATIOS[aspectRatio]};
          background-color: var(--color);
        `}
      />
      <picture>
        {srcSet.length ? (
          <>
            <source type="image/webp" srcSet={srcSet.join(', ')} sizes="" />
            <source srcSet={srcSet.join(', ')} sizes="" />
            <img
              sizes=""
              srcSet={srcSet.join(', ')}
              src={srcSet[0]}
              alt={alt}
              loading="lazy"
              className="absolute inset-0 object-cover object-center w-full h-full"
              css={css`
                image-rendering: pixelated;
              `}
            />
          </>
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="absolute inset-0 object-cover object-center w-full h-full"
            css={css`
              image-rendering: pixelated;
            `}
          />
        )}
      </picture>
    </div>
  )
}

export default React.memo(Image)
