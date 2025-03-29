const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const multer = require('multer');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

let users = {};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    if (req.file) {
        res.json({ avatarUrl: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).send('No file uploaded');
    }
});

wss.on('connection', (ws) => {
    const id = Date.now();
    users[id] = { x: 100, y: 100, avatar: '/default-avatar.png' };

    ws.send(JSON.stringify({ type: 'init', id, users }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'move') {
            users[data.id].x = data.position.x;
            users[data.id].y = data.position.y;
        } else if (data.type === 'chat') {
            broadcast({ type: 'chat', message: data.message });
        } else if (data.type === 'update-avatar') {
            users[data.id].avatar = data.avatarUrl;
        }
        broadcast({ type: 'update', users });
    });

    ws.on('close', () => {
        delete users[id];
        broadcast({ type: 'update', users });
    });
});

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

server.listen(8080, () => {
    console.log('Server running at http://localhost:8080');
});