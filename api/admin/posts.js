import jwt from 'jsonwebtoken'
import { getDb } from '../_db.js'
import { ObjectId } from 'mongodb'

function auth(req) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return false
  try { jwt.verify(token, process.env.JWT_SECRET); return true } catch { return false }
}

export default async function handler(req, res) {
  if (!auth(req)) return res.status(401).json({ error: 'Unauthorized' })

  const db = await getDb()
  const col = db.collection('posts')

  if (req.method === 'POST') {
    const { slug, title, description, coverImage, content, published } = req.body
    if (!slug || !title) return res.status(400).json({ error: 'slug and title are required' })
    const existing = await col.findOne({ slug })
    if (existing) return res.status(409).json({ error: 'Post with this slug already exists' })
    const post = { slug, title, description: description || '', coverImage: coverImage || '', content: content || '', published: published ?? false, date: new Date(), createdAt: new Date(), updatedAt: new Date() }
    await col.insertOne(post)
    return res.status(201).json(post)
  }

  if (req.method === 'PUT') {
    const { _id, ...update } = req.body
    if (!_id) return res.status(400).json({ error: '_id is required' })
    update.updatedAt = new Date()
    await col.updateOne({ _id: new ObjectId(_id) }, { $set: update })
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    const { _id } = req.body
    if (!_id) return res.status(400).json({ error: '_id is required' })
    await col.deleteOne({ _id: new ObjectId(_id) })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
