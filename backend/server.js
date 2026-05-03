const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3333;

app.use(cors({ origin: true }));
app.use(express.json());

// Simulação de banco de dados em memória
let appointments = [
  {
    id: '1',
    clientName: 'Ana Souza',
    serviceId: '1',
    date: new Date(Date.now() - 86400000).toISOString(),
    status: 'Concluído',
    notes: 'Manicure e esmaltação'
  },
  {
    id: '2',
    clientName: 'Julia Pereira',
    serviceId: '5',
    date: new Date(Date.now() + 3600000).toISOString(),
    status: 'Agendado',
    notes: 'Pedicure express'
  }
];

const sseClients = new Set();

function broadcastAppointments() {
  const payload = `data: ${JSON.stringify(appointments)}\n\n`;
  sseClients.forEach((res) => {
    res.write(payload);
  });
}

app.get('/appointments', (req, res) => {
  res.json(appointments);
});

app.post('/appointments', (req, res) => {
  const { id, clientName, serviceId, date, status, notes } = req.body;

  if (!id || !clientName || !serviceId || !date || !status) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  }

  const newAppointment = { id, clientName, serviceId, date, status, notes: notes || null };
  appointments.push(newAppointment);
  broadcastAppointments();
  res.status(201).json(newAppointment);
});

app.patch('/appointments/:id/status', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status é obrigatório.' });
  }

  const appointmentIndex = appointments.findIndex(apt => apt.id === id);
  if (appointmentIndex === -1) {
    return res.status(404).json({ error: 'Agendamento não encontrado.' });
  }

  appointments[appointmentIndex].status = status;
  broadcastAppointments();
  res.json(appointments[appointmentIndex]);
});

app.delete('/appointments/:id', (req, res) => {
  const id = req.params.id;
  const appointmentIndex = appointments.findIndex(apt => apt.id === id);

  if (appointmentIndex === -1) {
    return res.status(404).json({ error: 'Agendamento não encontrado.' });
  }

  const deleted = appointments.splice(appointmentIndex, 1)[0];
  broadcastAppointments();
  res.json(deleted);
});

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const initPayload = `data: ${JSON.stringify(appointments)}\n\n`;
  res.write(initPayload);
  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

app.listen(port, () => {
  console.log(`Backend Akcit rodando em http://localhost:${port}`);
  console.log('Nota: Usando banco de dados em memória - dados serão perdidos ao reiniciar o servidor.');
});
