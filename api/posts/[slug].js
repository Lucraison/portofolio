import { getDb } from '../_db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { slug } = req.query

  try {
    const db = await getDb()
    const post = await db.collection('posts').findOneAndUpdate(
      { slug, published: true },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    )
    if (!post) return res.status(404).json({ error: 'Post not found' })
    return res.status(200).json(post)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch post' })
  }
}
