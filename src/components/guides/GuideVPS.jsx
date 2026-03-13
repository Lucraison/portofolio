import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const SECTIONS = [
    {
        id: 'intro',
        label: 'Why Hetzner',
        title: 'Hey you! Ever wanted to host a modded server and looked at these prices?',
        content: `Most Minecraft hosting services do everything for you — and charge you for it. Here's what the market looks like for a decent 8GB modded server:`,
        images: [
            { src: '/images/guides/vps/modrinth-pricing.png', caption: 'Modrinth — $20/mo billed quarterly' },
            { src: '/images/guides/vps/apex-pricing.png', caption: 'Apex Hosting — $27.99/mo' },
            { src: '/images/guides/vps/bisect-pricing.png', caption: 'Bisect Hosting — €26.67/mo' },
        ],
        after: `Now look at Hetzner. A CPX32 gives you 4 vCPUs, 8GB RAM, 160GB SSD, and 20TB traffic for €12.69/month. The catch? You set it up yourself. This guide shows you exactly how.`,
        afterImage: { src: '/images/guides/vps/hetzner-pricing.png', caption: 'Hetzner CPX32 — €12.69/mo' },
    },
    {
        id: 'account',
        label: 'Create a project',
        title: 'Step 1 — Create a Hetzner account and a project',
        content: `Head to hetzner.com and create an account. Once inside, you land on the projects page. Create a new project — name it whatever you want. This is just an organizer for your servers.`,
        images: [
            { src: '/images/guides/vps/hetzner-dashboard.png', caption: 'Hetzner dashboard — create a new project' },
        ],
    },
    {
        id: 'server',
        label: 'Create a server',
        title: 'Step 2 — Create a server',
        content: `Go into your project and click "Add Server". You'll go through a few configuration steps:`,
        images: [
            { src: '/images/guides/vps/hetzner-location.png', caption: 'Pick a location close to you — Nuremberg or Helsinki if you\'re in Europe' },
            { src: '/images/guides/vps/hetzner-type.png', caption: 'Regular Performance is fine. CPX32 (8GB RAM) is the sweet spot for modded Minecraft' },
            { src: '/images/guides/vps/hetzner-image.png', caption: 'Pick Ubuntu 24.04 — it\'s the easiest to work with' },
            { src: '/images/guides/vps/hetzner-networking.png', caption: 'Leave networking as default — Public IPv4 and IPv6 checked' },
        ],
    },
    {
        id: 'ssh',
        label: 'SSH key',
        title: 'Step 3 — Set up an SSH key',
        content: `Before creating the server, set up an SSH key. This lets you log in without a password every time.

On your PC, open a terminal and run:`,
        code: `ssh-keygen -t ed25519 -C "your_email@example.com"`,
        codeNote: `Hit enter through all the prompts. This creates two files — a private key (keep this safe, never share it) and a public key ending in .pub.`,
        code2: `# On Windows, your key is usually at:
C:\\Users\\YourName\\.ssh\\id_ed25519.pub

# On Mac/Linux:
~/.ssh/id_ed25519.pub`,
        after: `Open the .pub file, copy everything inside, and paste it into the SSH key field in Hetzner before creating the server.`,
        images: [
            { src: '/images/guides/vps/hetzner-ssh.png', caption: 'Add your public key here before creating the server' },
        ],
    },
    {
        id: 'name',
        label: 'Name and create',
        title: 'Step 4 — Name your server and create it',
        content: `Give your server a name — Hetzner auto-generates one based on your specs and location, which is fine. Click "Create & Buy Now". Your server will be ready in about 30 seconds.`,
        images: [
            { src: '/images/guides/vps/hetzner-name.png', caption: 'Default name is fine, or rename it to something cleaner' },
        ],
    },
    {
        id: 'login',
        label: 'Connect via SSH',
        title: 'Step 5 — Log into your server',
        content: `Once the server is created, Hetzner shows you the IP address. Open a terminal and connect:`,
        code: `ssh root@YOUR_SERVER_IP`,
        after: `If you set up the SSH key correctly, it logs you straight in. No password needed. First thing to do once you're in — update the system:`,
        code2: `apt update && apt upgrade -y`,
    },
    {
        id: 'minecraft',
        label: 'Upload server files',
        title: 'Step 6 — Upload your Minecraft server files',
        content: `Download the server pack for your modpack — most modpacks on platforms like Modrinth or CurseForge have a separate server download. It comes as a zip file.

Send it to your VPS using SCP (takes 5-10 minutes depending on your connection):`,
        code: `scp server-pack.zip root@YOUR_SERVER_IP:/root/`,
        after: `Then on the server, install unzip and Java, and extract the files:`,
        code2: `apt install unzip default-jre -y
unzip server-pack.zip -d minecraft
cd minecraft`,
    },
    {
        id: 'screen',
        label: 'Run with screen',
        title: 'Step 7 — Run the server with screen',
        content: `If you start the server normally and close your terminal, it stops. Screen keeps it running in the background.`,
        code: `apt install screen -y
screen -S minecraft`,
        after: `Now start your server inside the screen session. Once it's running, detach from screen without stopping it:`,
        code2: `# Start the server (check your modpack's start script)
bash start.sh

# Detach from screen (server keeps running)
Ctrl + A, then D

# Reattach later when you need to run commands
screen -r minecraft`,
    },
    {
        id: 'backups',
        label: 'Automated backups',
        title: 'Step 8 — Set up automated backups',
        content: `Create a backup script that zips your server files and deletes old backups automatically.`,
        code: `nano /root/backup.sh`,
        after: `Paste this into the file:`,
        code2: `#!/bin/bash
BACKUP_DIR="/root/backups"
SOURCE_DIR="/root/minecraft"
DATE=$(date +%Y-%m-%d_%H-%M)
MAX_BACKUPS=5

mkdir -p $BACKUP_DIR
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" $SOURCE_DIR

# Delete oldest backups if more than MAX_BACKUPS exist
ls -t $BACKUP_DIR/backup_*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm`,
        after2: `Make it executable and set up crontab to run it automatically:`,
        code3: `chmod +x /root/backup.sh

# Open crontab
crontab -e

# Add this line to run backup every day at 4am
0 4 * * * /root/backup.sh`,
    },
]

function CodeBlock({ code }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div style={{ position: 'relative', marginBottom: '20px' }}>
            <pre style={{ background: 'var(--bg)', border: '0.5px solid var(--border)', padding: '20px 24px', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)', overflowX: 'auto', lineHeight: 1.7, margin: 0 }}>
                <code>{code}</code>
            </pre>
            <button onClick={handleCopy} style={{ position: 'absolute', top: '10px', right: '10px', fontFamily: 'var(--mono)', fontSize: '10px', color: copied ? 'var(--accent2)' : 'var(--muted)', background: 'var(--bg1)', border: '0.5px solid var(--border)', padding: '4px 10px', cursor: 'pointer', letterSpacing: '0.08em' }}>
                {copied ? 'copied!' : 'copy'}
            </button>
        </div>
    )
}

function Screenshot({ src, caption }) {
    const [lightbox, setLightbox] = useState(false)
    return (
        <>
            {lightbox && (
                <div onClick={() => setLightbox(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: '40px' }}>
                    <img src={src} alt={caption} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', border: '0.5px solid var(--border-hi)' }} />
                </div>
            )}
            <div style={{ marginBottom: '24px' }}>
                <div onClick={() => setLightbox(true)} style={{ border: '0.5px solid var(--border)', overflow: 'hidden', cursor: 'zoom-in', background: 'var(--bg1)' }}>
                    <img src={src} alt={caption} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                </div>
                {caption && <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted2)', marginTop: '8px', letterSpacing: '0.04em' }}>{caption}</p>}
            </div>
        </>
    )
}

export default function GuideVPS() {
    const navigate = useNavigate()
    const [active, setActive] = useState('intro')

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--sans)' }}>
            <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 40px', height: '56px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg)', transform: 'translateZ(0)' }}>
                <button onClick={() => navigate('/')} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}>
                    ← back
                </button>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--accent)', letterSpacing: '0.05em', marginLeft: 'auto' }}>NH_</span>
            </nav>

            <div style={{ display: 'flex', maxWidth: '1100px', margin: '0 auto', padding: '80px 40px 80px' }}>

                {/* sidebar */}
                <div style={{ width: '200px', flexShrink: 0, paddingTop: '40px', paddingRight: '40px', position: 'sticky', top: '80px', alignSelf: 'flex-start' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>// steps</div>
                    {SECTIONS.map((s, i) => (
                        <a key={s.id} href={`#${s.id}`} onClick={() => setActive(s.id)} style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '11px', color: active === s.id ? 'var(--accent)' : 'var(--muted)', textDecoration: 'none', padding: '6px 0', letterSpacing: '0.06em', borderLeft: active === s.id ? '2px solid var(--accent)' : '2px solid transparent', paddingLeft: '12px', transition: 'all 0.2s' }}>
                            {i === 0 ? s.label : `${i}. ${s.label}`}
                        </a>
                    ))}
                </div>

                {/* content */}
                <div style={{ flex: 1, paddingTop: '40px' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>// guide</div>
                    <h1 style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.2, marginBottom: '8px' }}>
                        Hosting a Modded Minecraft Server on a VPS
                    </h1>
                    <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted2)', marginBottom: '64px', letterSpacing: '0.06em' }}>
                        Hetzner + Ubuntu + screen + crontab
                    </p>

                    {SECTIONS.map((section) => (
                        <div key={section.id} id={section.id} style={{ marginBottom: '80px', scrollMarginTop: '80px' }}>
                            <h2 style={{ fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 400, color: 'var(--text)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '0.5px solid var(--border)' }}>
                                {section.title}
                            </h2>
                            {section.content.split('\n\n').map((p, i) => (
                                <p key={i} style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '16px' }}>{p}</p>
                            ))}
                            {section.code && <CodeBlock code={section.code} />}
                            {section.codeNote && <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '16px', fontStyle: 'italic' }}>{section.codeNote}</p>}
                            {section.code2 && <CodeBlock code={section.code2} />}
                            {section.after && <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '16px' }}>{section.after}</p>}
                            {section.afterImage && <Screenshot src={section.afterImage.src} caption={section.afterImage.caption} />}
                            {section.after2 && <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '16px' }}>{section.after2}</p>}
                            {section.code3 && <CodeBlock code={section.code3} />}
                            {section.images && section.images.map((img, i) => (
                                <Screenshot key={i} src={img.src} caption={img.caption} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}