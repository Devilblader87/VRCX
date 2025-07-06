const express = require('express');
const path = require('path');
const notifier = require('node-notifier');
const InteropApi = require('./InteropApi');
const interopApi = new InteropApi();

const app = express();
const PORT = process.env.PORT || 3000;
const AUTH_TOKEN = process.env.VRCX_AUTH_TOKEN || null;

app.use(express.json());

function authMiddleware(req, res, next) {
  if (AUTH_TOKEN) {
    const header = req.get('authorization') || '';
    const token = header.replace(/^Bearer\s+/i, '');
    if (token !== AUTH_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
  next();
}

app.use(authMiddleware);

app.post('/api/dotnet', async (req, res) => {
  const { className, methodName, args = [] } = req.body || {};
  try {
    const result = await interopApi.callMethod(className, methodName, args);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
});

app.post('/api/window/apply-settings', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/dialog/openFile', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

app.get('/api/dialog/openDirectory', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

app.post('/api/notification', (req, res) => {
  const { title, body, icon } = req.body || {};
  notifier.notify({ title, message: body, icon });
  res.json({ ok: true });
});

app.post('/api/app/restart', () => {
  process.exit(0);
});

const staticDir = path.resolve(__dirname, '../build/html');
app.use(express.static(staticDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
