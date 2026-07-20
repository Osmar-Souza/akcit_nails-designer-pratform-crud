# Relatório de Status para Stakeholders

## Projeto: Plataforma CRUD Nails Designer
## Data: [inserir data]
## Responsável: [seu nome]

### 1. Resumo do status
- A entrega principal do sistema de agendamento está sendo desenvolvida.
- Já existem funcionalidades de CRUD para agendamentos, painel de agenda e login básico.
- Identificamos riscos críticos nas áreas de segurança, validação, concorrência e tratamento de erros.

### 2. Riscos operacionais atuais
1. **Autenticação fraca**
   - Hoje, o login está implementado com credenciais internas e armazenamento simples no navegador.
   - Risco: acesso indevido ou perfil errado pode gerar exclusões ou alterações não autorizadas.

2. **Validação de agendamento insuficiente**
   - O formulário atual aceita dados mínimos sem checar data futura ou serviço válido.
   - Risco: horário errado ou agendamento inválido compromete a agenda do salão.

3. **Tratamento de erros pobre**
   - Falhas são logadas no console, mas não exibidas para a usuária.
   - Risco: equipe não sabe quando uma operação falhou e não consegue agir.

4. **Possível conflito de agendamento concorrente**
   - A verificação de disponibilidade ainda depende de lógica de consulta e não de uma regra forte de banco de dados.
   - Risco: horários podem se sobrepor com múltiplos acessos simultâneos.

### 3. Andamento das correções
- Levantamento de riscos concluído.
- As ações de mitigação propostas estão documentadas e priorizadas.
- Precisamos aprovar as correções de maior impacto antes de seguir com a entrega final.

### 4. Próximas etapas
- Implementar autenticação segura com login real e backend protegido.
- Adicionar validação robusta de data e serviço no formulário de agendamento.
- Melhorar feedback de erro visível para a equipe e clientes.
- Reforçar a integridade de agendamentos no banco de dados.

### 5. Decisão necessária das donas
- Desejam priorizar:
  - A. Segurança de acesso e autorização imediata?
  - B. Qualidade do agendamento e prevenção de conflitos?
  - C. Melhor experiência de erro para equipe/clientes?
- Recomendação:
  - Priorizar A e B juntos, pois hoje o sistema ainda corre risco de uso indevido e de agendamentos incorretos.

### 6. Observações
- A estrutura de entrega sugerida pela professora deve conter:
  - `riscos/identificacao.md`
  - `riscos/analise.md`
  - `riscos/respostas.md`
  - `comunicacao/status-stakeholders.md`
- Use este relatório como base para o fórum e para o relatório de status do projeto.
