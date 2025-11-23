import express from 'express';
import os from 'os';
const router = express.Router();

// Store server start time for uptime calculation
const serverStartTime = Date.now();

// Health check
router.get('/', (req, res) => {
  const uptime = Date.now() - serverStartTime;
  const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
  const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

  res.status(200).json({
    ok: true,
    version: '1.0',
    timestamp: new Date().toISOString(),
    uptime: `${uptimeHours}h ${uptimeMinutes}m`,
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      memory: {
        total: Math.round(os.totalmem() / 1024 / 1024) + 'MB',
        free: Math.round(os.freemem() / 1024 / 1024) + 'MB',
        used: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024) + 'MB'
      },
      cpu: os.cpus().length + ' cores'
    }
  });
});

export default router;