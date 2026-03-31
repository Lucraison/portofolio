import { Resend } from 'resend'
import { getDb } from './_db.js'

const resend = new Resend(process.env.RESEND_API_KEY)
const RATE_LIMIT_MINUTES = 15

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, message, website } = req.body || {}

  // Honeypot field for basic bot protection.
  if (typeof website === 'string' && website.trim()) {
    return res.status(200).json({ success: true })
  }

  const cleanName = String(name || '').trim()
  const cleanEmail = String(email || '').trim().toLowerCase()
  const cleanMessage = String(message || '').trim()

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] ?? 'unknown'

  try {
    const db = await getDb()

    const cutoff = new Date(Date.now() - RATE_LIMIT_MINUTES * 60 * 1000)
    const recent = await db.collection('ratelimits').findOne({ ip, lastSubmit: { $gt: cutoff } })
    if (recent) {
      return res.status(429).json({ error: `Too many requests. Please wait ${RATE_LIMIT_MINUTES} minutes before sending another message.` })
    }

    await db.collection('ratelimits').updateOne(
      { ip },
      { $set: { lastSubmit: new Date() } },
      { upsert: true }
    )

    await db.collection('messages').insertOne({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage.slice(0, 5000),
      ip,
      createdAt: new Date(),
    })

    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'nicolas.nataniel79@gmail.com',
      subject: `New message from ${cleanName}`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\n${cleanMessage.slice(0, 5000)}`,
    })

    return res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}
