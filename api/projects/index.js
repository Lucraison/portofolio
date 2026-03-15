import { getDb } from '../_db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const db = await getDb()
    const projects = await db.collection('projects').find().sort({ createdAt: -1 }).toArray()
    return res.status(200).json(projects)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch projects' })
  }
}
