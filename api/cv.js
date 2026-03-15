import { getDb } from './_db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const db = await getDb()
    await db.collection('cv_downloads').insertOne({
      ip: req.headers['x-forwarded-for']?.split(',')[0] ?? 'unknown',
      downloadedAt: new Date(),
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to log download' })
  }
}
