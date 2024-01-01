# Notes Server Documentation

The **Notes Server** is a backend application built with Node.js, Express, and MongoDB. It provides API endpoints for user authentication, note creation, retrieval, update, and deletion. This documentation provides a comprehensive guide on how to use and interact with the Notes Server.

## Table of Contents

- [Notes Server Documentation](#notes-server-documentation)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
  - [User Authentication](#user-authentication)
    - [User Registration](#user-registration)
    - [User Login](#user-login)
  - [Notes Management (Protected Routes)](#notes-management-protected-routes)
    - [Create a Note](#create-a-note)
    - [Get All Notes](#get-all-notes)
    - [Get Note by ID](#get-note-by-id)
    - [Update Note by ID](#update-note-by-id)
    - [Delete Note by ID](#delete-note-by-id)
  - [API Endpoints](#api-endpoints)
    - [POST /register](#post-register)
    - [POST /login](#post-login)
    - [POST /notes](#post-notes)
    - [GET /notes](#get-notes)
    - [GET /notes/:id](#get-notesid)
    - [PUT /notes/:id](#put-notesid)
    - [DELETE /notes/:id](#delete-notesid)
  - [Error Handling](#error-handling)
  - [Running the Server](#running-the-server)

---

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB server running

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
ATLAS_STRING=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-jwt-secret-key>
PORT=<server-port>
```

## User Authentication

### User Registration

**Endpoint**: `POST /register`

- **Request:**
  - `username`: User's username (min length: 3)
  - `email`: User's email address
  - `password`: User's password (min length: 8)

```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "secure_password"
}
```

- **Response:**
  - `message`: Success message

```json
{
  "message": "User created"
}
```

### User Login

**Endpoint**: `POST /login`

- **Request:**
  - `username`: User's username (min length: 3)
  - `password`: User's password (min length: 8)

```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

- **Response:**
  - `username`: User's username
  - `email`: User's email address
  - `accessToken`: JWT access token for authentication

```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "accessToken": "<jwt-access-token>"
}
```

## Notes Management (Protected Routes)

**Note**: Include the `accessToken` in the Headers of subsequent requests with the key `Authorization`:

```
Authorization: <jwt-access-token>
```

### Create a Note

**Endpoint**: `POST /notes`

- **Request:**
  - `title`: Note title (min length: 3)
  - `content`: Note content (min length: 10)

```json
{
  "title": "Meeting Notes",
  "content": "Discuss project milestones and goals."
}
```

- **Response:**
  - `message`: Success message
  - `noteId`: ID of the created note
  - `title`: Title of the created note
  - `content`: Content of the created note
  - `creation`: Timestamp of note creation
  - `lastEdit`: Timestamp of last note edit

```json
{
  "message": "Note created",
  "noteId": 1,
  "title": "Meeting Notes",
  "content": "Discuss project milestones and goals.",
  "creation": "2023-01-01T12:00:00.000Z",
  "lastEdit": "2023-01-01T12:00:00.000Z"
}
```

### Get All Notes

**Endpoint**: `GET /notes`

- **Response:**
  - Array of notes

```json
[
  {
    "id": 1,
    "title": "Meeting Notes",
    "content": "Discuss project milestones and goals.",
    "creation": "2023-01-01T12:00:00.000Z",
    "lastEdit": "2023-01-01T12:00:00.000Z"
  },
  // ... other notes
]
```

### Get Note by ID

**Endpoint**: `GET /notes/:id`

- **Response:**
  - Note object

```json
{
  "id": 1,
  "title": "Meeting Notes",
  "content": "Discuss project milestones and goals.",
  "creation": "2023-01-01T12:00:00.000Z",
  "lastEdit": "2023-01-01T12:00:00.000Z"
}
```

### Update Note by ID

**Endpoint**: `PUT /notes/:id`

- **Request:**
  - `title`: Updated note title (min length: 3)
  - `content`: Updated note content (min length: 10)

```json
{
  "title": "Updated Meeting Notes",
  "content": "Discuss revised project milestones and goals."
}
```

- **Response:**
  - `message`: Success message
  - `title`: Updated title
  - `content`: Updated content
  - `lastEdit`: Timestamp of last note edit

```json
{
  "message": "Note updated",
  "title": "Updated Meeting Notes",
  "content": "Discuss revised project milestones and goals.",
  "lastEdit": "2023-01-01T13:00:00.000Z"
}
```

### Delete Note by ID

**Endpoint**: `DELETE /notes/:id`

- **Response:**
  - `message`: Success message

```json
{
  "message": "Note deleted"
}
```

## API Endpoints

### POST /register

- **Request:**
  - `username`: User's username (min length: 3)


  - `email`: User's email address
  - `password`: User's password (min length: 8)

```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "secure_password"
}
```

- **Response:**
  - `message`: Success message

```json
{
  "message": "User created"
}
```

### POST /login

- **Request:**
  - `username`: User's username (min length: 3)
  - `password`: User's password (min length: 8)

```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

- **Response:**
  - `username`: User's username
  - `email`: User's email address
  - `accessToken`: JWT access token for authentication

```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "accessToken": "<jwt-access-token>"
}
```

### POST /notes

- **Request:**
  - `title`: Note title (min length: 3)
  - `content`: Note content (min length: 10)

```json
{
  "title": "Meeting Notes",
  "content": "Discuss project milestones and goals."
}
```

- **Response:**
  - `message`: Success message
  - `noteId`: ID of the created note
  - `title`: Title of the created note
  - `content`: Content of the created note
  - `creation`: Timestamp of note creation
  - `lastEdit`: Timestamp of last note edit

```json
{
  "message": "Note created",
  "noteId": 1,
  "title": "Meeting Notes",
  "content": "Discuss project milestones and goals.",
  "creation": "2023-01-01T12:00:00.000Z",
  "lastEdit": "2023-01-01T12:00:00.000Z"
}
```

### GET /notes

- **Response:**
  - Array of notes

```json
[
  {
    "id": 1,
    "title": "Meeting Notes",
    "content": "Discuss project milestones and goals.",
    "creation": "2023-01-01T12:00:00.000Z",
    "lastEdit": "2023-01-01T12:00:00.000Z"
  },
  // ... other notes
]
```

### GET /notes/:id

- **Response:**
  - Note object

```json
{
  "id": 1,
  "title": "Meeting Notes",
  "content": "Discuss project milestones and goals.",
  "creation": "2023-01-01T12:00:00.000Z",
  "lastEdit": "2023-01-01T12:00:00.000Z"
}
```

### PUT /notes/:id

- **Request:**
  - `title`: Updated note title (min length: 3)
  - `content`: Updated note content (min length: 10)

```json
{
  "title": "Updated Meeting Notes",
  "content": "Discuss revised project milestones and goals."
}
```

- **Response:**
  - `message`: Success message
  - `title`: Updated title
  - `content`: Updated content
  - `lastEdit`: Timestamp of last note edit

```json
{
  "message": "Note updated",
  "title": "Updated Meeting Notes",
  "content": "Discuss revised project milestones and goals.",
  "lastEdit": "2023-01-01T13:00:00.000Z"
}
```

### DELETE /notes/:id

- **Response:**
  - `message`: Success message

```json
{
  "message": "Note deleted"
}
```

## Error Handling

The server returns appropriate error responses for invalid requests or authentication issues.

- **422 Unprocessable Entity:**
  - Invalid data in the request body during user registration or login.

  ```json
  {
    "error": "Invalid data"
  }
  ```

- **401 Unauthorized:**
  - Invalid or missing JWT token during note creation, retrieval, update, or deletion.

  ```json
  {
    "error": "Unauthorized: Token not provided"
  }
  ```

  ```json
  {
    "error": "Forbidden: Invalid token"
  }
  ```

- **400 Bad Request:**
  - Bad request during user registration, login, note creation, retrieval, update, or deletion.

  ```json
  {
    "error": "Bad request"
  }
  ```

## Running the Server

To start the server, run the following command:

```bash
npm run dev
```

The server will be running on the specified port, and you can make requests to the provided API endpoints.