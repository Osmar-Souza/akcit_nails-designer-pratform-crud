# Identificação de Riscos Técnicos

1. **Autenticação e autorização fracas**
   - Onde ocorre:
     - `backend/server.js` em `POST /login` usa credenciais hardcoded (`USERS` com `admin/admin123` e `client/client123`).
     - `src/app/login-screen/login-screen.component.ts` usa apenas botões de escolha de perfil, sem entrada segura de usuário/senha.
     - `src/app/auth.service.ts` armazena token JWT no `localStorage` e não implementa logout server-side ou expiração forçada.
   - Por quê é crítico:
     - Permite acesso indevido ou simulação de perfis administradores, comprometendo o CRUD de agendamentos.

2. **Validação insuficiente de agendamento no frontend**
   - Onde ocorre:
     - `src/app/new-booking-modal/new-booking-modal.component.ts` só verifica campos obrigatórios (`clientName`, `serviceId`, `date`).
     - `src/app/new-booking-modal/new-booking-modal.component.html` usa `required`, mas não valida data/hora futura, serviço válido ou duplicidade de horário antes de enviar.
   - Por quê é crítico:
     - Pode permitir agendamentos inválidos ou confusos enviados ao backend, prejudicando operações do salão.

3. **Tratamento de erros e feedback inexistentes para o usuário**
   - Onde ocorre:
     - `src/app/appointment.service.ts` apenas registra erros no console (`console.error`) e não informa o usuário.
     - `src/app/app.component.ts` no login mostra falha apenas em `console.error`, sem mensagem recebida.
     - `backend/server.js` retorna mensagens genéricas e não diferencia bem falhas de validação, concorrência ou autenticação.
   - Por quê é crítico:
     - Clientes e atendentes não sabem se uma operação falhou; isso aumenta retrabalho e perda de confiança no sistema.

4. **Risco de concorrência e disponibilidade de agendamentos**
   - Onde ocorre:
     - `backend/server.js` em `hasAppointmentConflict()` e `POST /appointments` tenta usar `SERIALIZABLE`, mas depende apenas de lógica de consulta em vez de uma restrição de banco de dados.
     - `GET /availability` calcula horários disponíveis apenas em tempo de requisição, sem garantir que o slot não será reservado por outra operação imediatamente depois.
   - Por quê é crítico:
     - Pode gerar agendamentos sobrepostos ou disponibilidade incorreta, causando conflitos na agenda do salão.
