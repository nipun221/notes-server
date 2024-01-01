const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require("cors");
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.ATLAS_STRING, {
    dbName: 'notes-data',
});
  
const db = mongoose.connection;
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    },
    email: {    
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
});

// Define note schema
const noteSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {    
        type: String,
        required: true,
    },
    creation: {
        type: Date,
        required: true,
    },
    lastEdit: {
        type: Date,
        required: true,
    },
});

// Hash password before saving user to database
userSchema.pre('save', async function(next) {
    const user = this;
    const hash = await bcrypt.hash(user.passwordHash, 10);
    user.passwordHash = hash;
    next();
});

// Define user model
const User = mongoose.model('User', userSchema);

// Define note model
const Note = mongoose.model('Note', noteSchema);

// JWT secret key
const jwtSecretKey = process.env.JWT_SECRET || 'secret';

// Middleware to authenticate user
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    jwt.verify(token, jwtSecretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }

        req.user = user;
        next();
    });
}

// User registration
app.post('/register', [
    body('username').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Invalid data' });
    }

    const { username, email, password } = req.body;

    try {
        const user = new User({
            username: username,
            email: email,
            passwordHash: password,
        });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(400).json({ error: 'Bad request' });
    }
});

// User login 
app.post('/login', [
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 8 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Invalid data' });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (await bcrypt.compare(password, user.passwordHash)) {
            const accessToken = jwt.sign({ username: user.username }, jwtSecretKey);
            res.status(200).json({ username: user.username, email: user.email, accessToken: accessToken });
        } else {
            res.status(401).json({ error: 'Unauthorized: Invalid username or password' });
        }
    } catch (err) {
        res.status(400).json({ error: 'Bad request' });
    }
});

// Create note
app.post('/notes', [
    body('title').isLength({ min: 3 }),
    body('content').isLength({ min: 10 }),
], authenticateToken, async (req, res) => {
    const { title, content } = req.body;

    try {
        // Find the last note in the database
        const lastNote = await Note.findOne({}, {}, { sort: { 'id': -1 } });

        // Calculate the new note's ID
        const newNoteId = (lastNote ? lastNote.id : 0) + 1;

        const note = new Note({
            id: newNoteId,
            title: title,
            content: content,
            creation: Date.now(),
            lastEdit: Date.now(),
        });

        await note.save();
        res.status(201).json({ message: 'Note created', noteId: newNoteId, title: note.title, content: note.content, creation: note.creation, lastEdit: note.lastEdit });
    } catch (err) {
        res.status(400).json({ error: 'Bad request' });
    }
});

// Get all notes
app.get('/notes', authenticateToken, async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (err) {
        res.status(400).json({ error: 'Bad request' });
    }
});

// Get note by id
app.get('/notes/:id', authenticateToken, async (req, res) => {
    try {
        const note = await Note.findOne({ id: req.params.id });
        res.status(200).json(note);
    } catch (err) {
        res.status(400).json({ error: 'Bad request' });
    }
});

// Update note by id
app.put('/notes/:id', [
    body('title').isLength({ min: 3 }),
    body('content').isLength({ min: 10 }),
], authenticateToken, async (req, res) => {
    const { title, content } = req.body;

    try {
        const note = await Note.findOne({ id: req.params.id });
        note.title = title;
        note.content = content;
        note.lastEdit = Date.now();
        await note.save();
        res.status(200).json({ message: 'Note updated', title: note.title, content: note.content, lastEdit: note.lastEdit });
    } catch (err) {
        res.status(400).json({ error: 'Bad request' });
    }
});

// Delete note by id
app.delete('/notes/:id', authenticateToken, async (req, res) => {
    try {
        await Note.deleteOne({ id: req.params.id });
        res.status(200).json({ message: 'Note deleted' });
    } catch (err) {
        res.status(400).json({ error: 'Bad request' });
    }
});

// PORT Setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));