import { MongoClient } from 'mongodb'
import { Resend } from 'resend'

const client = new MongoClient(process.env.MONGODB_URI)
const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  try {
    await client.connect()
    const db = client.db('portfolio')
    await db.collection('messages').insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    })

    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'nicolas.nataniel79@gmail.com',
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    })

    return res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}
