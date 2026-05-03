# Backend Akcit Nails

Servidor Express.js para a API de agendamentos do salão de beleza.

## Tecnologias

- Node.js
- Express.js
- CORS

## Endpoints da API

### GET /appointments
Lista todos os agendamentos.

**Resposta:**
```json
[
  {
    "id": "1",
    "clientName": "Ana Souza",
    "serviceId": "1",
    "date": "2026-05-02T22:00:42.599Z",
    "status": "Concluído",
    "notes": "Manicure e esmaltação"
  }
]
```

### POST /appointments
Cria um novo agendamento.

**Corpo da requisição:**
```json
{
  "id": "3",
  "clientName": "João Silva",
  "serviceId": "2",
  "date": "2026-05-05T14:00:00.000Z",
  "status": "Agendado",
  "notes": "Corte de cabelo"
}
```

### PATCH /appointments/:id/status
Atualiza o status de um agendamento.

**Corpo da requisição:**
```json
{
  "status": "Concluído"
}
```

### GET /stream
Endpoint Server-Sent Events (SSE) para atualizações em tempo real dos agendamentos.

## Executando

```bash
npm install
npm start
```

O servidor roda em `http://localhost:3333`.

## Notas

- Atualmente usa banco de dados em memória
- Dados são perdidos ao reiniciar o servidor
- Para produção, implementar persistência (SQLite, PostgreSQL, etc.)