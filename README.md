# MERN File Sharing App

This project is a file-sharing web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- Upload and share files within your local network (LAN)
- Download files via unique links
- View file metadata (name, size, upload time)
- Drag-and-drop upload with progress bar
- Clean, responsive UI

## Getting Started

### Frontend (React)

1. Navigate to the project root and run:
   ```sh
   npm install
   npm run dev
   ```

### Backend (Express/Node)

1. Navigate to the `server` directory:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   npm start
   ```

### MongoDB

- Ensure MongoDB is running locally or update the connection string in the backend config.

## Notes

- Files are only accessible within the same local network.
- For development, run both frontend and backend servers simultaneously.
