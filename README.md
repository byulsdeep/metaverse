# 2D Metaverse

Welcome to **2D Metaverse**, a simple multiplayer web-based environment where users can move around, chat, and upload avatars in a shared virtual space.

## Features
- **Real-time multiplayer**: Move your character around in a 2D space.
- **WebSockets-powered communication**: Instant updates for player movement and chat messages.
- **Custom avatars**: Upload an image to personalize your avatar.
- **Simple chat system**: Send messages to other users in the metaverse.

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your system.

### Steps to run locally
1. Clone the repository:
   ```sh
   git clone https://github.com/byulsdeep/metaverse.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   node app.js
   ```
4. Open a web browser and visit:
   ```
   http://localhost:8080
   ```

## How to Play
- Move using **WASD** keys.
- Click on the chatbox, type a message, and hit **Enter** or click **Send**.
- Change your display name in the input field.
- Upload a custom avatar using the file input and upload button.

## Project Structure
```
📂 2d-metaverse
├── 📁 public
│   ├── 📁 uploads        # Stores user-uploaded avatars
│   ├── index.html       # Frontend UI
│   ├── styles.css       # Basic styling
│   ├── script.js        # Client-side logic
├── server.js            # Express + WebSocket server
├── package.json         # Project dependencies
```

## Technologies Used
- **Node.js** - Backend server
- **Express.js** - Web framework
- **WebSockets** - Real-time communication
- **Multer** - File upload handling

## Future Improvements
- Add more interactive elements (furniture, objects, etc.).
- Implement persistent user sessions.
- Enhance avatar customization.


