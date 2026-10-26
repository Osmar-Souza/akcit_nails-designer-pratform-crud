# Testes de integração apoiados por GenAI

## Cenário

Considerei o fluxo de cadastro e consulta de um registro relacionado à plataforma Nail Designer. Nesse cenário, a interface envia os dados para a API REST, a API valida e persiste o registro, e a interface apresenta o resultado ao usuário.

Como os detalhes do contrato da API podem variar conforme a implementação, os nomes de campos, rotas e mensagens abaixo são exemplos. Antes de transformar estes casos em testes automatizados, eles devem ser conferidos com os endpoints e as regras reais do projeto.

## Prompt 1 — Fluxo principal de cadastro e consulta

> Gere casos de teste de integração para o fluxo de cadastro e consulta de um registro em uma plataforma Nail Designer. Considere a comunicação entre a interface e uma API REST: a interface envia os dados, a API valida e salva o registro, e depois a interface consulta e exibe a lista atualizada. Inclua cenários de sucesso e duplicidade, quando aplicável. Para cada caso, informe objetivo, pré-condições, dados de entrada, chamadas envolvidas e resultado esperado. Não invente rotas ou regras que não foram fornecidas; sinalize as informações que precisam ser confirmadas no contrato da API.

### Casos gerados

| ID | Cenário | Dados e execução | Resultado esperado |
|---|---|---|---|
| INT-01 | Cadastro realizado com sucesso | Enviar à API um registro válido, usando os campos exigidos pelo contrato do projeto. Depois, solicitar a listagem. | A API responde com sucesso; o registro é persistido e aparece na listagem com os dados esperados. A interface apresenta confirmação sem duplicar o envio. |
| INT-02 | Consulta da lista sem registros | Iniciar com a coleção vazia e solicitar a listagem pela interface. | A API responde com sucesso e uma coleção vazia; a interface apresenta o estado vazio previsto, sem erro. |
| INT-03 | Registro duplicado, se houver regra de unicidade | Enviar novamente um registro que viole uma regra de unicidade definida pelo projeto. | A API rejeita ou trata a duplicidade conforme o contrato; a interface informa o resultado e não exibe dois registros equivalentes. |

## Prompt 2 — Validações e falhas na comunicação

> Gere casos de teste de integração para o cadastro de um registro em uma plataforma Nail Designer quando houver dados obrigatórios ausentes ou inválidos, indisponibilidade da API ou erro interno do servidor. Considere a integração entre interface e API REST. Para cada caso, informe dados de entrada, resposta HTTP esperada somente quando puder ser inferida do contrato, comportamento esperado da interface e como verificar que dados inválidos ou não confirmados não foram persistidos. Use ambiente de teste e dados fictícios; não faça chamadas a produção. Não invente mensagens, rotas ou códigos de status: marque como “a confirmar no contrato” quando necessário.

### Casos gerados

| ID | Cenário | Dados e execução | Resultado esperado |
|---|---|---|---|
| INT-04 | Campo obrigatório ausente | Enviar o cadastro sem um campo que o contrato define como obrigatório. | A API rejeita a requisição segundo o contrato; a interface informa a validação; nenhuma nova linha é persistida. O código e o formato da resposta devem ser confirmados na API. |
| INT-05 | Valor inválido | Enviar um valor fora do formato ou limite documentado para um campo. | A API rejeita o valor segundo o contrato; a interface apresenta uma mensagem compreensível; o registro inválido não é persistido. |
| INT-06 | API indisponível ou falha de rede | Simular timeout ou indisponibilidade da API no ambiente de teste. | A interface apresenta o estado de erro previsto, não informa sucesso e permite uma nova tentativa conforme o comportamento definido no projeto. Não deve haver persistência parcial. |
| INT-07 | Erro interno na API | Simular uma resposta de erro do servidor durante o cadastro. | A interface trata a falha sem travar, não mostra confirmação de cadastro e apresenta o retorno definido pelo produto. Confirmar o código HTTP e o tratamento esperado no contrato. |

## Como os prompts influenciaram os casos

O primeiro prompt direcionou a geração para o fluxo normal entre interface e API. Isso ajudou a incluir não apenas o envio do cadastro, mas também a consulta posterior para verificar se o registro persistido aparece na listagem. O cenário de coleção vazia e a possibilidade de duplicidade ampliaram a cobertura do fluxo.

O segundo prompt direcionou a análise para entradas inválidas e falhas de comunicação. Com isso, os casos passaram a verificar também o que a interface apresenta ao usuário e se uma falha impede a persistência indevida de dados.

## Ajustes feitos nos prompts

Foi necessário informar o contexto da plataforma, delimitar a integração entre interface e API REST e pedir que cada caso descrevesse entrada, execução e resultado esperado. Também foi importante orientar a LLM a não inventar rotas, códigos HTTP, mensagens ou regras de negócio ausentes do contrato. Por fim, especifiquei o uso de ambiente de teste e dados fictícios para evitar alterações em dados reais.

## Observações para transformar os casos em testes automatizados

- Conferir os campos obrigatórios, regras de validação, unicidade e respostas HTTP no código ou na documentação da API.
- Usar o banco de dados de teste ou mecanismos de isolamento e limpeza de dados entre execuções.
- Simular falhas de rede e respostas de erro sem depender de serviços externos ou do ambiente de produção.
- Verificar tanto a resposta da API quanto o comportamento da interface e a persistência resultante.

## Repositório

Projeto: <https://github.com/Osmar-Souza/akcit_nails-designer-pratform-crud>

