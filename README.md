# Tic Tac Toe App

This project is a simple Tic Tac Toe game with a modern front-end and a Node.js/Express backend for user authentication.

---

## Project Structure

```
tic-tac-toe-app
├── client                # Front-end application (TypeScript, Tailwind CSS)
│   ├── index.html        # Main HTML document
│   ├── styles.css        # Tailwind CSS styles
│   ├── src/
│   │   ├── app.ts        # Main TypeScript logic for the game
│   │   └── components/   # Game, Board, Player, AI classes
│   └── tailwind.config.js
├── user_server           # Simple Node.js/Express backend for user auth
│   ├── app.js            # Express server with hardcoded users
│   └── package.json      # Backend dependencies (express, cors)
└── README.md             # Project overview and setup instructions
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- (Optional) [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code

---

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/tic-tac-toe-app.git
   cd tic-tac-toe-app
   ```

2. **Install backend dependencies:**
   ```sh
   cd user_server
   npm install
   ```

   This will install `express` and `cors`.

3. **(Optional) Install client dependencies:**
   - If you use Tailwind via npm, run `npm install` in the `client` folder.
   - If you use CDN for Tailwind, you can skip this step.

---

### Running the Application

1. **Start the backend server:**
   ```sh
   cd user_server
   npm start
   ```
   The server will run at [http://localhost:3000](http://localhost:3000).

2. **Start the client:**
   - Open `client/index.html` in your browser, or
   - Use Live Server in VS Code to serve the `client` folder.

---

## Usage

- **Login:**  
  Use one of the hardcoded users to log in:
  - `alice` / `alice123`
  - `bob` / `bob456`

- **Register:**  
  You can register a new user via the `/api/register` endpoint (e.g., with Postman).

- **Play:**  
  After logging in, you can play Tic Tac Toe against the AI.

---

## API Endpoints (Backend)

- `POST /api/auth`  
  Authenticate user.  
  Body: `{ "name": "alice", "password": "alice123" }`  
  Response: `{ "success": true }` or `{ "success": false }`

- `POST /api/register`  
  Register a new user.  
  Body: `{ "name": "newuser", "password": "pw" }`

- `GET /api/users`  
  List all registered usernames (for testing/demo).

---

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

---

## License

This project is licensed under the MIT License.