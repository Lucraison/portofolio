import jwt from 'jsonwebtoken'
import { getDb } from '../_db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  try {
    const db = await getDb()
    const [messages, viewDoc, downloads, posts] = await Promise.all([
      db.collection('messages').find().sort({ createdAt: -1 }).toArray(),
      db.collection('views').findOne({ _id: 'total' }),
      db.collection('cv_downloads').countDocuments(),
      db.collection('posts').find().sort({ date: -1 }).toArray(),
    ])
    return res.status(200).json({
      messages,
      views: viewDoc?.count ?? 0,
      downloads,
      posts,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch data' })
  }
}
