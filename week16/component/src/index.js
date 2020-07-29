import { createElement } from './createElement.js'
import Carousel from './Carousel.js'
// import Carousel from './carousel.view'

const component = (
  <Carousel
    items={[
      'https://placehold.it/1280x640/d91234/f0f0f4/?text=1',
      'https://placehold.it/1280x640/2bcc66/f0f0f4/?text=2',
      'https://placehold.it/1280x640/4598db/f0f0f4/?text=3',
      'https://placehold.it/1280x640/303030/f0f0f4/?text=4',
    ]}
    autoplay={true}
    duration={1000}
    easing="ease"
    delay={3000}
  />
)

component.mountTo(document.querySelector('#root'))

console.log(component)
