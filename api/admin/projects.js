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
  const col = db.collection('projects')

  if (req.method === 'POST') {
    const { id, name, year, desc, content, tags, status, url, guideUrl, images } = req.body
    if (!id || !name) return res.status(400).json({ error: 'id and name are required' })
    const existing = await col.findOne({ id })
    if (existing) return res.status(409).json({ error: 'Project with this id already exists' })
    const project = { id, name, year: year || '', desc: desc || '', content: content || '', tags: tags || [], status: status || 'unfinished', url: url || '', guideUrl: guideUrl || '', images: images || [], createdAt: new Date(), updatedAt: new Date() }
    await col.insertOne(project)
    return res.status(201).json(project)
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
