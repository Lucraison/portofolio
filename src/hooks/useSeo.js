import { useEffect } from 'react'

const ensureMeta = (selector, attrs) => {
  let node = document.head.querySelector(selector)
  if (!node) {
    node = document.createElement('meta')
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v))
    document.head.appendChild(node)
  }
  return node
}

export default function useSeo({ title, description, image, noindex = false }) {
  useEffect(() => {
    const previousTitle = document.title
    const descNode = ensureMeta('meta[name="description"]', { name: 'description' })
    const ogTitleNode = ensureMeta('meta[property="og:title"]', { property: 'og:title' })
    const ogDescNode = ensureMeta('meta[property="og:description"]', { property: 'og:description' })
    const ogImageNode = ensureMeta('meta[property="og:image"]', { property: 'og:image' })
    const robotsNode = ensureMeta('meta[name="robots"]', { name: 'robots' })

    const previous = {
      description: descNode.getAttribute('content') || '',
      ogTitle: ogTitleNode.getAttribute('content') || '',
      ogDescription: ogDescNode.getAttribute('content') || '',
      ogImage: ogImageNode.getAttribute('content') || '',
      robots: robotsNode.getAttribute('content') || '',
    }

    if (title) document.title = title
    if (description) {
      descNode.setAttribute('content', description)
      ogDescNode.setAttribute('content', description)
    }
    if (title) ogTitleNode.setAttribute('content', title)
    if (image) ogImageNode.setAttribute('content', image)
    robotsNode.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow')

    return () => {
      document.title = previousTitle
      descNode.setAttribute('content', previous.description)
      ogTitleNode.setAttribute('content', previous.ogTitle)
      ogDescNode.setAttribute('content', previous.ogDescription)
      ogImageNode.setAttribute('content', previous.ogImage)
      robotsNode.setAttribute('content', previous.robots)
    }
  }, [title, description, image, noindex])
}
