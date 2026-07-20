# Análise de Impacto e Probabilidade

## 1. Autenticação e autorização fracas
- Impacto:
  - Alto. Um usuário não autorizado pode obter acesso administrativo e alterar ou cancelar agendamentos, prejudicando a operação do salão.
  - Pode expor dados de clientes e permitir manipulação indevida da agenda.
- Probabilidade:
  - Alta. O código atual usa credenciais fixas e armazenamento simples no navegador, facilitando exploração mesmo por usuários não técnicos.

## 2. Validação insuficiente de agendamento no frontend
- Impacto:
  - Alto. Agendamentos com dados incorretos geram erros de operação, horário errado e insatisfação do cliente.
  - Pode causar perda de receita se horários inválidos ocuparem slots úteis.
- Probabilidade:
  - Média a alta. A interface aceita facilmente campos vazios ou datas inválidas e não apresenta bloqueios antes do envio.

## 3. Tratamento de erros e feedback inexistentes
- Impacto:
  - Médio. Equipe do salão fica sem visibilidade sobre falhas, o que aumenta suporte e retrabalho.
  - Em casos de erro crítico, o atendimento pode ser afetado sem saber o motivo.
- Probabilidade:
  - Alta. O código atual registra erros apenas no console e não apresenta alertas ou mensagens no UI.

## 4. Concorrência e disponibilidade de agendamentos
- Impacto:
  - Alto. Horários duplos ou disponibilidade incorreta podem causar clientes agendados em conflito e perda de confiança.
  - Pode gerar vários cancelamentos e diminuição da eficiência.
- Probabilidade:
  - Média. A aplicação já tenta controlar conflito por consulta, mas sem bloqueio/constraint declarativo, o risco existe especialmente com acessos simultâneos.
