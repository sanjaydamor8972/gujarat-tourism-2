import React, { useState } from 'react'
import { getPlaceImageUrl, getUnsplashFallback } from '../../utils/placeImages'
import { getCatalogGallery, resolvePlaceImageKey } from '../../data/placeImageCatalog'

function PlaceImage({ place, src, index = 0, alt = '', className = '', ...props }) {
  const catalogGallery = place && resolvePlaceImageKey(place) ? getCatalogGallery(place) : null
  const [fallbackStep, setFallbackStep] = useState(0)
  const [currentSrc, setCurrentSrc] = useState(
    () => src || getPlaceImageUrl(place, index)
  )

  function handleError() {
    const nextStep = fallbackStep + 1

    if (catalogGallery?.length) {
      const nextUrl = catalogGallery[nextStep % catalogGallery.length]
      if (nextUrl && nextUrl !== currentSrc) {
        setFallbackStep(nextStep)
        setCurrentSrc(nextUrl)
        return
      }
    }

    setFallbackStep(nextStep)
    setCurrentSrc(getUnsplashFallback(nextStep, place))
  }

  return (
    <img
      src={currentSrc}
      alt={alt || place?.title || 'Gujarat destination'}
      className={className}
      onError={handleError}
      loading="lazy"
      referrerPolicy="no-referrer"
      {...props}
    />
  )
}

export default PlaceImage
