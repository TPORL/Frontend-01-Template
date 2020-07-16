import createElement, { Text, Wrapper } from './createElement.js'
import Carousel from './carousel.js'

const component = (
  <Carousel
    images={[
      'https://placehold.it/1280x640?text=1',
      'https://placehold.it/1280x640?text=2',
      'https://placehold.it/1280x640?text=3',
      'https://placehold.it/1280x640?text=4',
    ]}
  />
)

component.mountTo(document.body)

console.log(component)
