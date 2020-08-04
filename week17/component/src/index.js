import { createElement } from './createElement.js'
import Carousel from './components/carousel/Carousel.js'
import Tabs from './components/tabs/Tabs.js'
import List from './components/List/List.js'

const data = [
  { title: 'Pic 1', url: 'https://picsum.photos/100/100?random=1' },
  { title: 'Pic 2', url: 'https://picsum.photos/100/100?random=2' },
  { title: 'Pic 3', url: 'https://picsum.photos/100/100?random=3' },
  { title: 'Pic 4', url: 'https://picsum.photos/100/100?random=4' },
]

const component = (
  <div>
    <Carousel
      items={[
        'https://picsum.photos/1280/640?random=1',
        'https://picsum.photos/1280/640?random=2',
        'https://picsum.photos/1280/640?random=3',
        'https://picsum.photos/1280/640?random=4',
      ]}
      autoplay={true}
      duration={1000}
      easing="ease"
      delay={3000}
    />
    <br />
    <Tabs style="margin-bottom: 10px;">
      <div title="tab 1">This is content 1.</div>
      <div title="tab 2">This is content 2.</div>
      <div title="tab 3">This is content 3.</div>
      <div title="tab 4">This is content 4.</div>
    </Tabs>
    <br />
    <List
      dataSource={data}
      renderItem={(item) => (
        <figure class="list-item">
          <img src={item.url} alt={item.title} />
          <figcaption>{item.title}</figcaption>
        </figure>
      )}
    />
  </div>
)

component.mountTo(document.getElementById('root'))
