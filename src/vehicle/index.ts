const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

const db = new sqlite3.Database('./vehicle.db');

app.get('/vehicles', (req, res) => {
    db.all('SELECT * FROM Vehicle', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/vehicles', (req, res) => {
    const { PlateNumber, Model, Year, Color } = req.body;
    const sql = `INSERT INTO Vehicle (PlateNumber, Model, Year, Color) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [PlateNumber, Model, Year, Color], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, ...req.body });
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});