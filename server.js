import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.SERVER_PORT ?? 5174);
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ?? '';
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'replace-with-a-strong-secret';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';

if (!ADMIN_PASSWORD_HASH) {
  console.warn('WARNING: ADMIN_PASSWORD_HASH is not configured. Admin login will fail until the password hash is set.');
}

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 30,
  },
}));

const isAuthenticated = (req) => Boolean(req.session?.user);

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid request body' });
  }

  if (username.trim() !== ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!validPassword) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  req.session.user = { username: ADMIN_USERNAME };
  res.json({ success: true });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get('/api/session', (req, res) => {
  res.json({ loggedIn: isAuthenticated(req) });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
