import * as React from 'react'

import { Image } from './Image'

type Slide = {
  url: string
  alt?: string
  caption?: string
}

type SlidesProps = {
  slides: Array<Slide>
}

export const Slides: React.FC<SlidesProps> = ({ slides }) => {
  if (!slides || slides?.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {slides.map((slide) => (
        <div key={slide.url} className="space-y-2">
          <Image src={slide.url} alt={slide.alt || ''} />
          {slide.caption ? <div dangerouslySetInnerHTML={{ __html: slide.caption }} /> : null}
        </div>
      ))}
    </div>
  )
}

export default Slides
