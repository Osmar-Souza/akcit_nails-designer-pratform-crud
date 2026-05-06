require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3333;
const databaseUrl =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/akcit';

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const sseClients = new Set();

app.use(cors({ origin: true }));
app.use(express.json());

const appointmentSelect = `
  id,
  client_name AS "clientName",
  service_id AS "serviceId",
  date,
  status,
  notes,
  created_at AS "createdAt"
`;

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      service_id TEXT NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getAppointments() {
  const { rows } = await pool.query(`
    SELECT ${appointmentSelect}
    FROM appointments
    ORDER BY date ASC
  `);

  return rows;
}

async function broadcastAppointments() {
  try {
    const appointments = await getAppointments();
    const payload = `data: ${JSON.stringify(appointments)}\n\n`;
    sseClients.forEach((res) => res.write(payload));
  } catch (error) {
    console.error('Erro ao fazer broadcast:', error);
  }
}

app.get('/appointments', async (req, res) => {
  try {
    const appointments = await getAppointments();
    res.json(appointments);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
});

app.post('/appointments', async (req, res) => {
  try {
    const { id, clientName, serviceId, date, status, notes } = req.body;

    if (!id || !clientName || !serviceId || !date || !status) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO appointments (id, client_name, service_id, date, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ${appointmentSelect}
      `,
      [id, clientName, serviceId, new Date(date), status, notes || null]
    );

    await broadcastAppointments();
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

app.patch('/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status é obrigatório.' });
    }

    const { rows } = await pool.query(
      `
      UPDATE appointments
      SET status = $1
      WHERE id = $2
      RETURNING ${appointmentSelect}
      `,
      [status, id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    await broadcastAppointments();
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

app.delete('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `
      DELETE FROM appointments
      WHERE id = $1
      RETURNING ${appointmentSelect}
      `,
      [id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    await broadcastAppointments();
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    res.status(500).json({ error: 'Erro ao deletar agendamento' });
  }
});

app.get('/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const appointments = await getAppointments();
    const initPayload = `data: ${JSON.stringify(appointments)}\n\n`;
    res.write(initPayload);
  } catch (error) {
    console.error('Erro ao enviar dados iniciais:', error);
  }

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

ensureSchema()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Backend Akcit rodando em http://localhost:${port}`);
      console.log(`📦 Usando PostgreSQL: ${databaseUrl}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro ao inicializar o banco de dados:', error);
    process.exit(1);
  });