const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

// เชื่อมต่อกับไฟล์ฐานข้อมูลที่คุณเพิ่งสร้าง
const db = new sqlite3.Database('./vehicle.db');

// 1. GET: ดึงข้อมูลรถทั้งหมด
app.get('/vehicles', (req, res) => {
    db.all('SELECT * FROM Vehicle', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. POST: เพิ่มข้อมูลรถใหม่
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