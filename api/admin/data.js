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
    const since = new Date()
    since.setMonth(since.getMonth() - 5)
    since.setDate(1)
    since.setHours(0, 0, 0, 0)

    const [messages, viewDoc, downloads, posts, visitLogs, eventRows] = await Promise.all([
      db.collection('messages').find().sort({ createdAt: -1 }).toArray(),
      db.collection('views').findOne({ _id: 'total' }),
      db.collection('cv_downloads').countDocuments(),
      db.collection('posts').find().sort({ date: -1 }).toArray(),
      db.collection('visit_logs').find().sort({ at: -1 }).limit(200).toArray(),
      db.collection('events').aggregate([
        { $match: { at: { $gte: since } } },
        {
          $group: {
            _id: {
              month: { $dateToString: { format: '%Y-%m', date: '$at' } },
              type: '$type',
            },
            count: { $sum: 1 },
          },
        },
      ]).toArray(),
    ])

    const monthlyEvents = {}
    eventRows.forEach((row) => {
      const key = row._id.month
      if (!monthlyEvents[key]) monthlyEvents[key] = { project_click: 0, contact_submit: 0 }
      monthlyEvents[key][row._id.type] = row.count
    })

    return res.status(200).json({
      messages,
      views: viewDoc?.count ?? 0,
      downloads,
      posts,
      visitLogs,
      monthlyEvents,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch data' })
  }
}
