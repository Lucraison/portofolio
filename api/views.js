import jwt from 'jsonwebtoken'
import { getDb } from './_db.js'

export default async function handler(req, res) {
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const db = await getDb()
    const col = db.collection('views')

    if (req.method === 'POST') {
      const referrer = req.headers['referer'] || req.headers['referrer'] || null
      const country = req.headers['x-vercel-ip-country'] || null
      await Promise.all([
        col.updateOne({ _id: 'total' }, { $inc: { count: 1 } }, { upsert: true }),
        db.collection('visit_logs').insertOne({ at: new Date(), referrer, country }),
      ])
    }

    if (req.method === 'DELETE') {
      const token = req.headers.authorization?.split(' ')[1]
      try { jwt.verify(token, process.env.JWT_SECRET) } catch {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      await Promise.all([
        col.updateOne({ _id: 'total' }, { $set: { count: 0 } }, { upsert: true }),
        db.collection('visit_logs').deleteMany({}),
      ])
      return res.status(200).json({ count: 0 })
    }

    const doc = await col.findOne({ _id: 'total' })
    return res.status(200).json({ count: doc?.count ?? 0 })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch views' })
  }
}
