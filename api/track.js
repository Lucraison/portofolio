import { getDb } from './_db.js'

const ALLOWED_TYPES = new Set(['project_click', 'contact_submit'])

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { type, projectId } = req.body || {}
  if (!ALLOWED_TYPES.has(type)) return res.status(400).json({ error: 'Invalid event type' })

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown'
  const ua = req.headers['user-agent'] || ''

  try {
    const db = await getDb()
    await db.collection('events').insertOne({
      type,
      projectId: projectId || null,
      ip,
      ua,
      at: new Date(),
    })
    return res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to track event' })
  }
}
