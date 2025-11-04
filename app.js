const express = require('express');
const db = require('./database-sqlite');

const app = express();
app.use(express.json());

// Get all events
app.get('/api/events', (req, res) => {
    db.all("SELECT * FROM events", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ events: rows });
    });
});

// Create event
app.post('/api/events', (req, res) => {
    const { name, location, start_date, description } = req.body;
    db.run(
        "INSERT INTO events (name, location, start_date, description) VALUES (?, ?, ?, ?)",
        [name, location, start_date, description],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});