# Setup & Deployment Guide

This guide covers local development, environment configuration, database management, cloud hosting deployment options, third-party credentials, and production operations for the **Data Analyst Learning Platform**.

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Local Development Setup](#2-local-development-setup)
3. [Environment Configuration](#3-environment-configuration)
4. [Database Management & Migrations](#4-database-management--migrations)
5. [Authentication & Email Verification](#5-authentication--email-verification)
6. [AI Tutor Integration (Google Gemini)](#6-ai-tutor-integration-google-gemini)
7. [Real-Time Chat & Video Calling (WebRTC / TURN)](#7-real-time-chat--video-calling-webrtc--turn)
8. [Cloud Deployment Options](#8-cloud-deployment-options)
   - [Option A: Render.com (Recommended with Persistent Disk)](#option-a-rendercom-recommended-with-persistent-disk)
   - [Option B: Railway.app (Persistent Volume)](#option-b-railwayapp-persistent-volume)
   - [Option C: Fly.io (Docker + Volume)](#option-c-flyio-docker--volume)
   - [Option D: Self-Hosted Linux VPS (Ubuntu + systemd + Nginx)](#option-d-self-hosted-linux-vps-ubuntu--systemd--nginx)
9. [Monitoring & Error Reporting (Sentry)](#9-monitoring--error-reporting-sentry)
10. [Custom Domain & SSL Setup (Cloudflare)](#10-custom-domain--ssl-setup-cloudflare)
11. [Troubleshooting & FAQs](#11-troubleshooting--faqs)

---

## 1. Architecture Overview

The platform uses a self-contained, high-performance Node.js architecture with zero heavy runtime dependencies:

- **Backend**: Built-in Node.js standard libraries (`node:http`, `node:crypto`, `node:fs`, `node:path`).
- **Database**: Native `node:sqlite` (`DatabaseSync`), requiring no external binary compiling or node-gyp builds.
- **Frontend**: Lightweight vanilla Single Page Application (SPA) with responsive CSS, hash router, and accessible UI.
- **AI Engine**: Hybrid engine — connects to Google Gemini API when configured, and falls back gracefully to a built-in pedagogical rule and analogy engine with transparent UI indicators.
- **Study Together**: WebRTC signaling server for peer-to-peer audio/video calls and real-time partner chat.

---

## 2. Local Development Setup

### Prerequisites
- Node.js **v22.5.0+** or **v24.0.0+** (which ships with native `node:sqlite`).
- On Windows systems with Antigravity installed, you can run directly using `agy-node`.

### Installation Steps

1. **Clone or Navigate to the Repository**:
   ```bash
   cd analystpath-ai
   ```

2. **Copy the Environment Template**:
   ```bash
   cp .env.example .env
   ```

3. **Verify Database Initialization & Seed Data**:
   The application automatically initializes the database schema and seeds all 17 comprehensive courses on first boot:
   ```bash
   node database.js
   ```

4. **Start the Development Server**:
   ```bash
   node server.js
   ```
   Or on Windows using the helper scripts:
   ```powershell
   .\start-server.ps1
   ```
   The platform will be available at `http://localhost:3000`.

---

## 3. Environment Configuration

All environment variables can be set in your system environment or a `.env` file:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port for the HTTP/WebSocket server. |
| `DATABASE_PATH` | `./analystpath.db` | Absolute or relative path to the SQLite database file. |
| `APP_NAME` | `Data Analyst Learning Platform` | Custom branding name shown in the header, title, and emails. |
| `PUBLIC_URL` | `http://localhost:3000` | Canonical base URL used for email verification and password reset links. |
| `ADMIN_EMAIL` | *(empty)* | Email address automatically granted the `admin` role upon registration. |
| `SESSION_SECRET` | Auto-generated secure token | Key used to sign session cookies and verification tokens. |
| `GEMINI_API_KEY` | *(empty)* | Optional Google Gemini API key. When present, enables cloud AI responses. |
| `STUN_SERVER` | `stun:stun.l.google.com:19302` | Public STUN server for WebRTC NAT traversal. |
| `TURN_SERVER_URL`| *(empty)* | Optional TURN server for symmetric NAT bypass. |
| `TURN_USERNAME`  | *(empty)* | Username for TURN server relay. |
| `TURN_CREDENTIAL`| *(empty)* | Password / credential for TURN server relay. |
| `SMTP_HOST`      | *(empty)* | SMTP hostname for transactional email delivery. |
| `SMTP_PORT`      | `587` | SMTP port (typically 587 for TLS, 465 for SSL). |
| `SMTP_USER`      | *(empty)* | SMTP username. |
| `SMTP_PASS`      | *(empty)* | SMTP password or API token. |

---

## 4. Database Management & Migrations

### Storage Engine
The database file `analystpath.db` contains:
- `users`: User accounts, PBKDF2 password hashes, verification tokens, and learning preferences.
- `sessions`: Active bearer authentication sessions.
- `study_groups` & `study_group_members`: Study squad teams, roles, and granular sharing privacy permissions.
- `group_milestones` & `group_reactions`: Celebrations and shared weekly goals.
- `chat_messages`: Partner chat history with links to lessons and projects.
- `courses` & `lessons`: The complete 17-course curriculum, syllabi, and bilingual lessons.
- `quizzes`, `quiz_questions`, `quiz_attempts`: Knowledge checks and weak topic tracking.
- `guided_projects` & `user_projects`: Portfolio projects, milestones, and deliverables.
- `practice_customers`, `practice_orders`, `practice_products`, `practice_employee_churn`: Built-in sandbox datasets.

### Backing Up SQLite
To create a clean backup while the server is running:
```bash
# Using SQLite CLI:
sqlite3 analystpath.db ".backup 'backup_analystpath_$(date +%Y%m%d).db'"
```

### Migration to Cloud PostgreSQL / LibSQL (Turso)
If you prefer a distributed managed database rather than a local SQLite file:
- **Turso / LibSQL**: Direct drop-in replacement with global replication using `@libsql/client`.
- **PostgreSQL**: The SQL schema in `database.js` uses standard ANSI SQL types (`TEXT`, `INTEGER`, `TIMESTAMP`, `CHECK` constraints) and can be ported to PostgreSQL by converting `AUTOINCREMENT` to `SERIAL` and using `pg` driver.

---

## 5. Authentication & Email Verification

### Development Mode
When `SMTP_HOST` is not configured, the platform operates in developer-friendly zero-friction mode:
- Registration creates a pending account with a unique token.
- The verification URL is logged to the server console and included in the API response:
  ```
  [DEV EMAIL LOG] To: learner@example.com
  Subject: Verify your account
  Link: http://localhost:3000/#verify?token=...
  ```
- The user can click the link directly in the app to activate their account.

### Production Setup (Resend / SendGrid / Amazon SES)
1. Sign up for a transactional email provider with a free tier:
   - **Resend** (3,000 free emails/month)
   - **Brevo / Sendinblue** (300 free emails/day)
   - **Amazon SES** (62,000 free emails/month when hosted on EC2)
2. Obtain your SMTP credentials and set them in your environment:
   ```env
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASS=re_your_api_key_here
   PUBLIC_URL=https://your-platform-domain.com
   ```

---

## 6. AI Tutor Integration (Google Gemini)

The AI tutor can operate in two distinct modes:

### Mode 1: Built-in Pedagogical Rule Engine (Default, Zero Cost)
- Requires no API key.
- Handles:
  - SQL query validation and syntax checks.
  - Excel formula syntax checks (XLOOKUP, INDEX/MATCH, SUMIFS).
  - Python Pandas debugging hints.
  - Step-by-step explanations in English and Hinglish.
  - Real-world analogies (e.g. Kirana store JOIN analogy, cricket match Mean vs. Median).
  - Progressive hints that reveal clues before the full answer.

### Mode 2: Live Google Gemini 1.5 Integration
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/) (free tier available with generous limits).
2. Set the environment variable:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
3. Restart the server. The AI Tutor drawer in the web interface will automatically show `Powered by Gemini 1.5 Pro` and provide dynamic conversational responses with full lesson context.

---

## 7. Real-Time Chat & Video Calling (WebRTC / TURN)

### Architecture
- **Signaling**: Handled over `/api/calls/signal` via HTTP polling/WebSockets.
- **Audio / Video Media**: Peer-to-peer encrypted WebRTC stream (direct browser-to-browser).

### STUN vs. TURN Requirements
- **STUN** (`stun:stun.l.google.com:19302`): Resolves public IP addresses and works for ~85% of home internet and mobile connections. Free and pre-configured.
- **TURN**: Necessary when both learners are behind symmetric NATs or strict corporate/university firewalls that block P2P connections.
  - **Free TURN Provider**: [Metered.ca](https://www.metered.ca/tools/openrelay/) provides 50 GB of free TURN relay bandwidth monthly.
  - Configure the credentials in `.env`:
    ```env
    TURN_SERVER_URL=turn:standard.relay.metered.ca:80
    TURN_USERNAME=your-metered-username
    TURN_CREDENTIAL=your-metered-credential
    ```

---

## 8. Cloud Deployment Options

### Option A: Render.com (Recommended with Persistent Disk)

Render provides free web services and persistent disk attachments for SQLite.

1. Create an account on [Render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub/GitLab repository.
4. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `echo "No build step required"`
   - **Start Command**: `node server.js`
   - **Plan**: Free or Starter
5. Under **Disks**, click **Add Disk**:
   - **Name**: `db-data`
   - **Mount Path**: `/var/data`
   - **Size**: `1 GB`
6. Under **Environment Variables**, set:
   - `DATABASE_PATH`: `/var/data/analystpath.db`
   - `NODE_ENV`: `production`
   - `APP_NAME`: `Your Platform Name`
   - `PUBLIC_URL`: `https://your-service-name.onrender.com`
7. Click **Deploy Web Service**.

---

### Option B: Railway.app (Persistent Volume)

1. Sign up on [Railway.app](https://railway.app).
2. Create a **New Project** and select **Deploy from GitHub repo**.
3. In service settings:
   - Add a **Volume** mounted at `/data`.
   - Set environment variables:
     ```
     DATABASE_PATH=/data/analystpath.db
     PORT=3000
     ```
4. Deploy the service. Railway will automatically provision an HTTPS URL.

---

### Option C: Fly.io (Docker + Volume)

Fly.io runs applications close to users with native persistent volume support:

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run `fly launch` in your project folder.
3. Create a persistent volume for SQLite:
   ```bash
   fly volumes create data_volume --size 1 --region sin
   ```
4. Update `fly.toml`:
   ```toml
   [mounts]
     source = "data_volume"
     destination = "/data"

   [env]
     DATABASE_PATH = "/data/analystpath.db"
     PORT = "8080"
   ```
5. Deploy: `fly deploy`.

---

### Option D: Self-Hosted Linux VPS (Ubuntu + systemd + Nginx)

For total control on a \$4-\$5/month VPS (DigitalOcean, Hetzner, Linode, AWS Lightsail):

1. **Install Node.js (v24)**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone Application & Set Permissions**:
   ```bash
   sudo mkdir -p /var/www/analystpath
   sudo chown -R $USER:$USER /var/www/analystpath
   git clone <repo-url> /var/www/analystpath
   cd /var/www/analystpath
   cp .env.example .env
   # Edit .env with your domain and settings
   ```

3. **Configure systemd Service** (`/etc/systemd/system/analystpath.service`):
   ```ini
   [Unit]
   Description=Data Analyst Learning Platform
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/analystpath
   ExecStart=/usr/bin/node /var/www/analystpath/server.js
   Restart=always
   RestartSec=10
   EnvironmentFile=/var/www/analystpath/.env

   [Install]
   WantedBy=multi-user.target
   ```

   Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now analystpath
   ```

4. **Configure Nginx Reverse Proxy with SSL**:
   ```nginx
   server {
       server_name learn.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Issue free Let's Encrypt certificate:
   ```bash
   sudo certbot --nginx -d learn.yourdomain.com
   ```

---

## 9. Monitoring & Error Reporting (Sentry)

To catch client-side and server-side errors in production:

1. Sign up for free at [Sentry.io](https://sentry.io).
2. Create a project and obtain your DSN URL (`https://xxx@sentry.io/yyy`).
3. For Frontend monitoring, include the Sentry script in `public/index.html`:
   ```html
   <script src="https://browser.sentry-cdn.com/7.x/bundle.min.js"></script>
   <script>
     if (window.Sentry) {
       Sentry.init({ dsn: "YOUR_SENTRY_DSN" });
     }
   </script>
   ```

---

## 10. Custom Domain & SSL Setup (Cloudflare)

1. In Cloudflare, add an **A record** pointing to your VPS IP address, or a **CNAME record** pointing to your Render / Railway app URL.
2. Set SSL/TLS encryption mode to **Full (Strict)**.
3. Enable **WebSockets** under Network settings to ensure real-time signaling runs smoothly.
4. Enable **Automatic HTTPS Rewrites** and **Brotli Compression** for optimal performance.

---

## 11. Troubleshooting & FAQs

- **Q: How do I change the platform name or branding?**  
  Set the `APP_NAME` environment variable in your `.env` or cloud dashboard. The platform will dynamically rebrand the title, logo text, navigation header, and email signatures.

- **Q: Are there any demo accounts pre-seeded?**  
  No. As required, zero fake or demo users are created. Every visitor registers with their own private account.

- **Q: Does video calling work without TURN credentials?**  
  Yes, as long as peers are not behind symmetric firewalls. Google's public STUN server is built-in and handles the majority of standard internet connections. For 100% guarantee across corporate or institutional networks, configure the free Metered.ca TURN server.

---

## 12. Administration, Moderation & Privacy Safeguards

### Administrator Account Provisioning
To assign an administrator without exposing public "make me admin" controls:
1. **Via Environment Variable**:
   Set `ADMIN_EMAIL=your-email@example.com` in `.env`. When this user registers, they are automatically elevated to the `admin` role.
2. **Via Command-Line Interface (CLI)**:
   Any registered user can be promoted directly using the secure command-line tool:
   ```bash
   node make-admin.js learner@example.com
   ```
   This updates the user's role to `'admin'` in `analystpath.db`.

### Administrator Console (`#admin`)
Once signed in as an administrator, an "Admin Console" link appears in the sidebar. The console provides four dedicated tabs:
- **User Accounts**: Search users, toggle account suspension (which immediately halts login capabilities), and permanently delete accounts with confirmation.
- **Security Audit Logs**: Minimal, privacy-preserving audit logs documenting registrations, sign-ins, password resets, and account suspensions.
- **Content Error Reports**: Real-time review queue of technical error reports, broken link flags, and syntax corrections submitted by learners.
- **User Misconduct Reports**: Review conduct flags filed by study squad members, with one-click user suspension.

### Strict Learner Privacy Safeguards
In adherence to strict zero-knowledge principles:
- **Private Notes**: Stored privately under the user's ID. Administrators cannot view learner notes.
- **Study Timetables & Quiz Choices**: Private by default. Not visible to administrators.
- **Partner Chat**: Confidential to the study squad members. Not logged in audit trails.

### Content Correction Workflow
We do not guarantee content is error-free. Every lesson contains a **🚩 Report Error / Suggest Correction** button that enables learners to report technical discrepancies directly to the admin queue. Administrators review and mark reports as resolved upon curriculum updates.

### Data Portability & Account Erasure (GDPR / CCPA)
Under **Settings & Privacy**:
- **Download All Account Data**: Exports user profile, progress, private notes, and submissions as a clean JSON file (`analystpath-export-<id>.json`).
- **Permanently Delete Account**: Prompts the learner to type "DELETE" and cascades deletion across all personal records, progress entries, and group memberships.
