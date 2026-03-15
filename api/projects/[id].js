import { getDb } from '../_db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query

  try {
    const db = await getDb()
    const project = await db.collection('projects').findOne({ id })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    return res.status(200).json(project)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch project' })
  }
}
