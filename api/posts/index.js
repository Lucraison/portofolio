import { getDb } from '../_db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const db = await getDb()
    const posts = await db.collection('posts')
      .find({ published: true })
      .sort({ date: -1 })
      .project({ content: 0 })
      .toArray()
    return res.status(200).json(posts)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch posts' })
  }
}
