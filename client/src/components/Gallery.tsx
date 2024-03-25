import { FC, useState, useEffect, Dispatch, SetStateAction } from 'react'
// gallery
import Lightbox from 'yet-another-react-lightbox'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import 'yet-another-react-lightbox/styles.css'

export const Gallery: FC<{
  images: string[]
  index: number
  setIndex: Dispatch<SetStateAction<number>>
}> = ({ images, index, setIndex }) => {
  const [slides, setSlides] = useState([])

  useEffect(() => {
    setSlides(
      images.map((src) => ({
        src,
      })),
    )
  }, [images])

  return (
    <Lightbox
      slides={slides}
      open={index >= 0}
      index={index}
      close={() => setIndex(-1)}
      plugins={[Fullscreen, Slideshow]}
    />
  )
}
