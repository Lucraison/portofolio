import { MongoClient } from 'mongodb'
import { readFileSync } from 'fs'
import { config } from 'dotenv'

config()

const client = new MongoClient(process.env.MONGODB_URI)

const projects = [
  {
    id: 'printnik',
    name: 'Printnik',
    year: '2025',
    desc: 'A document generation platform built for a real company. Import raw data, design templates visually, send to printer directly.',
    content: readFileSync('./src/content/projects/printnik.md', 'utf-8'),
    tags: ['REST API', 'Multi-tenant', 'Full Stack', 'Document Gen'],
    status: 'unfinished',
    url: '',
    guideUrl: '',
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'vps',
    name: 'Game Server Setup',
    year: '2025',
    desc: 'Self-managed Linux VPS on Hetzner running a modded Minecraft server 24/7. Configured from scratch: SSH keys, firewall, backup scripts, the works.',
    content: readFileSync('./src/content/projects/vps.md', 'utf-8'),
    tags: ['Linux', 'SSH', 'VPS', 'Hetzner', 'Bash'],
    status: 'live',
    url: '',
    guideUrl: '/guides/vps',
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'blackjack',
    name: 'Blackjack Card Detection',
    year: '2025',
    desc: 'Real-time card recognition using YOLOv8 with a custom Napoleon Live dataset built via Roboflow. Detects and classifies playing cards from a live video feed.',
    content: readFileSync('./src/content/projects/blackjack.md', 'utf-8'),
    tags: ['Python', 'YOLOv8', 'Computer Vision', 'Roboflow'],
    status: 'on hold',
    url: '',
    guideUrl: '',
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seed() {
  try {
    await client.connect()
    const db = client.db('portfolio')
    const col = db.collection('projects')

    for (const project of projects) {
      const existing = await col.findOne({ id: project.id })
      if (existing) {
        console.log(`skipping ${project.id} — already exists`)
      } else {
        await col.insertOne(project)
        console.log(`seeded ${project.id}`)
      }
    }

    console.log('done.')
  } finally {
    await client.close()
  }
}

seed()
