import { getDb } from './_db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const db = await getDb()
    const col = db.collection('views')

    if (req.method === 'POST') {
      await col.updateOne(
        { _id: 'total' },
        { $inc: { count: 1 } },
        { upsert: true }
      )
    }

    const doc = await col.findOne({ _id: 'total' })
    return res.status(200).json({ count: doc?.count ?? 0 })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch views' })
  }
}
