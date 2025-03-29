const ws = new WebSocket('ws://localhost:8080');
let userId, users = {};

function isTyping() {
    return document.activeElement.id === 'message' || document.activeElement.id === 'name';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        toggleFocusAndSendMessage();
    } else if (!userId || isTyping()) return;
    let { x, y, avatar } = users[userId];
    if (e.key === 'w') y -= 10;
    if (e.key === 's') y += 10;
    if (e.key === 'a') x -= 10;
    if (e.key === 'd') x += 10;
    users[userId] = { x, y, avatar };
    ws.send(JSON.stringify({ type: 'move', id: userId, position: { x, y } }));
    render();
});

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'init') {
        userId = data.id;
        users = data.users;
    } else if (data.type === 'update') {
        users = data.users;
    } else if (data.type === 'chat') {
        document.getElementById('chatbox').innerHTML += `<p>${data.message}</p>`;
        document.getElementById('chatbox').scrollTop = document.getElementById('chatbox').scrollHeight;
    }
    render();
};

function render() {
    const container = document.getElementById('game');
    container.innerHTML = '';
    for (let id in users) {
        let div = document.createElement('div');
        div.className = 'avatar';
        div.style.backgroundImage = `url('${users[id].avatar}')`;
        div.style.left = users[id].x + 'px';
        div.style.top = users[id].y + 'px';
        container.appendChild(div);
    }
}

document.getElementById('sendBtn').addEventListener('click', sendMessage);

document.getElementById('uploadAvatarBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('avatarInput');
    if (fileInput.files && fileInput.files[0]) {
        const formData = new FormData();
        formData.append('avatar', fileInput.files[0]);

        fetch('/upload-avatar', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.avatarUrl) {
                ws.send(JSON.stringify({ type: 'update-avatar', id: userId, avatarUrl: data.avatarUrl }));
            }
        })
        .catch(error => console.error('Error uploading avatar:', error));
    }
});

function toggleFocusAndSendMessage() {
    const messageInput = document.getElementById('message');
    if (document.activeElement.id !== 'message') {
        messageInput.focus();
    } else {
        if (messageInput.value.trim()) {
            sendMessage();
        }
    }
}

function sendMessage() {
    const message = document.getElementById('message').value.trim();
    if (!message) return;

    const name = document.getElementById('name').value.trim() || 'anonymous';
    ws.send(JSON.stringify({ type: 'chat', message: `${name} : ${message}` }));

    document.getElementById('message').value = '';
    document.body.focus();
}
