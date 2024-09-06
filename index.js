const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // CORS için gerekli modül

const app = express();
const port = 3000; // Sunucu portu

// PostgreSQL veritabanı bağlantısı
const pool = new Pool({
  user: 'yagmur',
  host: 'localhost',
  database: 'eventdb',
  password: '123',
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

app.use(cors()); // frontend ile backend farklı portlardaysa gerekir
app.use(express.json());

//Etkinlik ekleme
app.post('/events', async (req, res) => {
  const { name, date, location } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO events (name, date, location) VALUES ($1, $2, $3) RETURNING *',
      [name, date, location]
    );
    res.status(201).json(result.rows[0]); // Yanıt olarak eklenen etkinliği döndür
  } catch (err) {
    console.error('Database insert error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

//Güncelleme
app.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { name, date, location } = req.body;
  try {
    await pool.query(
      'UPDATE events SET name = $1, date = $2, location = $3 WHERE id = $4',
      [name, date, location, id]
    );
    res.status(200).send('Event updated');
  } catch (err) {
    console.error('Database update error:', err);
    res.status(500).send('Server error');
  }
});

//Etkinliği silme
app.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Event deleted', event: result.rows[0] });
    } else {
      res.status(404).send('Event not found');
    }
  } catch (err) {
    console.error('Database delete error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Listeleme
app.get('/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    res.status(200).json(result.rows); // Tüm etkinlikleri döndür
  } catch (err) {
    console.error('Database select error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('Event not found');
    }
  } catch (err) {
    console.error('Database select error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
