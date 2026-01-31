// index.js
import 'dotenv/config';
import express from 'express';
import SwitchBotAPI from 'switchbot-api';
import cors from 'cors';
import crypto from 'crypto';
import axios from 'axios';

const app = express();
const PORT = 3000;
const token = process.env.SWITCHBOT_TOKEN;
const secretkey = process.env.SWITCHBOT_SECRETKEY;

const api = new SwitchBotAPI(token,secretkey);

console.log(token)
console.log(secretkey)

app.use(cors());
app.use(express.json());

function createSwitchBotHeaders(token, secretkey) {
  const t = Date.now().toString();
  const nonce = crypto.randomUUID();
  const dataToSign = token + t + nonce;
  const sign = crypto.createHmac('sha256', secretkey)
                      .update(dataToSign)
                      .digest('base64');

  return {
    Authorization: token,
    t,
    sign,
    nonce,
    'Content-Type': 'application/json'
  };
}

app.get('/', async (req, res) => {
  try {
    const devices = await api.getDevices();
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

app.post('/devices/:id/:cmd', async (req, res) => {
  const { id, cmd } = req.params;
  const token = process.env.SWITCHBOT_TOKEN;
  const secretkey = process.env.SWITCHBOT_SECRETKEY;

  const command = cmd === 'off' ? 'turnOff' : 'turnOn';
  const body = {
    command,
    parameter: "default",
    commandType: "command"
  };

  try {
    const headers = createSwitchBotHeaders(token, secretkey);
    const response = await axios.post(
      `https://api.switch-bot.com/v1.1/devices/${id}/commands`,
      body,
      { headers }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.get('/temperature/:id', async (req, res) => {
  const deviceId = req.params.id;

  try {
    const headers = createSwitchBotHeaders(token, secretkey);
    const response = await axios.get(
      `https://api.switch-bot.com/v1.1/devices/${deviceId}/status`,
      { headers }
    );

    const body = response.data.body;

    if (!body) {
      return res.status(404).json({ error: 'Device status not found' });
    }

    res.json({
      temperature: body.temperature, 
      humidity: body.humidity,
      battery: body.battery
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
