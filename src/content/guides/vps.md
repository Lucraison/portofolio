# Hosting a Modded Minecraft Server on a VPS

## Why Hetzner

Hey you! Ever wanted to host a modded server and looked at these prices?

Most Minecraft hosting services do everything for you and charge you for it. Modrinth charges $20/mo billed quarterly, Apex Hosting $27.99/mo, and Bisect €26.67/mo — all for a basic 8GB server.

Now look at Hetzner. A CPX32 gives you 4 vCPUs, 8GB RAM, 160GB SSD, and 20TB traffic for €12.69/month. The catch? You set it up yourself. This guide shows you exactly how.

## Create a project

Head to hetzner.com and create an account. Once inside, you land on the projects page. Create a new project — name it whatever you want. This is just an organizer for your servers.

## Create a server

Go into your project and click "Add Server". You'll go through a few configuration steps:

- **Location** — pick one close to you. Nuremberg or Helsinki if you're in Europe.
- **Type** — Regular Performance is fine. CPX32 (8GB RAM) is the sweet spot for modded Minecraft.
- **Image** — pick Ubuntu 24.04. It's the easiest to work with.
- **Networking** — leave as default. Public IPv4 and IPv6 checked.

## Set up an SSH key

Before creating the server, set up an SSH key. This lets you log in without a password every time.

On your PC, open a terminal and run:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Hit enter through all the prompts. This creates two files — a private key (keep this safe, never share it) and a public key ending in .pub.
```bash
# On Windows, your key is usually at:
C:\Users\YourName\.ssh\id_ed25519.pub

# On Mac/Linux:
~/.ssh/id_ed25519.pub
```

Open the .pub file, copy everything inside, and paste it into the SSH key field in Hetzner before creating the server.

## Name your server and create it

Give your server a name — Hetzner auto-generates one based on your specs and location, which is fine. Click "Create & Buy Now". Your server will be ready in about 30 seconds.

## Connect via SSH

Once the server is created, Hetzner shows you the IP address. Open a terminal and connect:
```bash
ssh root@YOUR_SERVER_IP
```

If you set up the SSH key correctly, it logs you straight in. No password needed. First thing to do once you're in — update the system:
```bash
apt update && apt upgrade -y
```

## Upload your Minecraft server files

Download the server pack for your modpack — most modpacks on Modrinth or CurseForge have a separate server download. It comes as a zip file.

Send it to your VPS using SCP (takes 5-10 minutes depending on your connection):
```bash
scp server-pack.zip root@YOUR_SERVER_IP:/root/
```

Then on the server, install unzip and Java, and extract the files:
```bash
apt install unzip default-jre -y
unzip server-pack.zip -d minecraft
cd minecraft
```

## Run with screen

If you start the server normally and close your terminal, it stops. Screen keeps it running in the background.
```bash
apt install screen -y
screen -S minecraft
```

Now start your server inside the screen session. Once it's running, detach without stopping it:
```bash
# Start the server (check your modpack's start script)
bash start.sh

# Detach from screen (server keeps running)
# Press Ctrl + A, then D

# Reattach later when you need to run commands
screen -r minecraft
```

## Automated backups

Create a backup script that zips your server files and deletes old backups automatically.
```bash
nano /root/backup.sh
```

Paste this into the file:
```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
SOURCE_DIR="/root/minecraft"
DATE=$(date +%Y-%m-%d_%H-%M)
MAX_BACKUPS=5

mkdir -p $BACKUP_DIR
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" $SOURCE_DIR

# Delete oldest backups if more than MAX_BACKUPS exist
ls -t $BACKUP_DIR/backup_*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm
```

Make it executable and set up crontab to run it automatically:
```bash
chmod +x /root/backup.sh

# Open crontab
crontab -e

# Add this line to run backup every day at 4am
0 4 * * * /root/backup.sh
```