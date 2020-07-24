import createElement, { Text, Wrapper } from './createElement.js'
import Carousel from './carousel.js'
// import Carousel from './carousel.view'

const component = (
  <Carousel
    images={[
      'https://placehold.it/1280x640?text=1',
      'https://placehold.it/1280x640?text=2',
      'https://placehold.it/1280x640?text=3',
      'https://placehold.it/1280x640?text=4',
    ]}
    autoplay={false}
  />
)

component.mountTo(document.querySelector('#app'))

console.log(component)

window.play = () => component.play()
window.pause = () => component.pause()
