## Exercício de Gerenciamento de Riscos — Módulo 9

- **Repositório:** https://github.com/Osmar-Souza/akcit_nails-designer-pratform-crud
- **Cenário:** Projeto próprio, uma plataforma CRUD integrada para gerenciamento de profissionais Nails Designer (clientes, agendamentos de serviços e controle de faturamento).

---

### 🎯 Principais Riscos Identificados (4 críticos)

1. **Inconsistência por Concorrência em Agendamentos (Double Booking)**
   - *Descrição:* Risco de duas clientes tentarem reservar o mesmo horário com a mesma Nails Designer simultaneamente. Sem um mecanismo de trava (*locking*) pessimista/otimista ou restrição única no banco de dados (`UniqueConstraint` combinando data, hora e profissional), o sistema aceitará ambos, gerando conflito operacional na agenda do salão.

2. **Exposição de Dados Sensíveis por Falta de DTOs (Data Transfer Objects)**
   - *Descrição:* Expor as entidades diretas do banco de dados (como `Cliente` ou `Usuario`) diretamente nos endpoints `@RestController`. Isso pode expor acidentalmente senhas criptografadas, chaves primárias sequenciais ou dados de auditoria que o cliente frontend não deveria receber, além de permitir ataques de *Mass Assignment* (onde o usuário envia campos internos modificados na requisição).

3. **Injeção de Dados Inválidos por Ausência de Validação Estrita (`@Valid`)**
   - *Descrição:* Permitir que campos essenciais, como o telefone da cliente, preço do serviço ou data do agendamento, cheguem vazios (`null`) ou em formatos corrompidos nas rotas de `POST` e `PUT`. Sem a anotação `@Valid` combinada com regras do Hibernate Validator (como `@NotBlank` ou `@Future`), o banco registrará dados inconsistentes que quebram relatórios financeiros.

4. **Vulnerabilidade de Segurança nos Endpoints Restritos do CRUD**
   - *Descrição:* Ausência de uma camada de autenticação e autorização (como Spring Security com JWT) protegendo as rotas críticas de alteração de preços (`PUT /servicos`) e exclusão de registros (`DELETE /clientes`). Qualquer usuário com ferramentas como Postman ou Insomnia conseguiria manipular o faturamento e os dados do sistema anonimamente.

---

### 💡 Estratégia Principal: MITIGAR com Camada de Validação Robusta + Regras de Negócio no Service

**Por quê:** Em um sistema de agendamento e beleza, a integridade da agenda e a segurança dos dados das clientes são o coração do negócio. Prevenir erros de validação e duplicidade de horários antes que cheguem ao banco de dados PostgreSQL evita retrabalho técnico e garante a confiabilidade do software.

**Ações:**
- Implementar classes DTO específicas para a criação e atualização de registros, isolando a camada de persistência (JPA) da camada de controle (Web).
- Adicionar validações de esquema com annotations (`@NotNull`, `@Size`, `@Min`) nos DTOs e ativar a validação nos controllers usando `@Valid`.
- Criar uma regra de validação customizada na camada `@Service` que faz uma busca prévia no repositório (`existsByDataAndHoraAndNailsDesigner`) antes de efetuar o salvamento de qualquer agendamento.
- **Resultado:** Redução de falhas de consistência e blindagem inicial das rotas do CRUD contra dados malformados.