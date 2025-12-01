# Front-end Móvel

O projeto Saber+ é uma plataforma de conexão para aulas particulares, englobando busca filtrada por professores, agendamento e gestão de disponibilidade entre professores e alunos. Esta fase é dedicada ao desenvolvimento do Frontend Mobile. O objetivo é construir uma interface multiplataforma que permita aos usuários consultar, interagir e executar operações essenciais no sistema distribuído, consumindo dados do backend principal.
A prioridade é entregar uma experiência de usuário intuitiva, performática e acessível para dispositivos móveis, garantindo a portabilidade e a otimização para telas menores.

## Projeto da Interface
[Descreva o projeto da interface móvel da aplicação, incluindo o design visual, layout das páginas, interações do usuário e outros aspectos relevantes.]

### Wireframes

[Inclua os wireframes das páginas principais da interface, mostrando a disposição dos elementos na página.]

### Design Visual

[Descreva o estilo visual da interface, incluindo paleta de cores, tipografia, ícones e outros elementos gráficos.]

## Fluxo de Dados

[Diagrama ou descrição do fluxo de dados na aplicação.]

## Tecnologias Utilizadas

[Lista das tecnologias principais que serão utilizadas no projeto.]

## Considerações de Segurança

Em aplicações distribuídas, a segurança é um aspecto fundamental para garantir a integridade, confidencialidade e disponibilidade das informações. No contexto de um Frontend Mobile Nativo com React Native, diversas medidas são cruciais para proteger o aplicativo contra vulnerabilidades e acessos indevidos.

* **Autenticação:** Implementação de fluxos de autenticação com JWT Token através de APIs do backend. O token de acesso deve ser armazenado de forma segura no dispositivo.
* **Autorização:** O frontend deve respeitar as permissões do usuário para exibir ou ocultar elementos/funcionalidades, mas a autorização final e crítica deve sempre ser validada pelo backend antes de processar qualquer requisição.
* **Validação de Entrada:** Validação rigorosa dos dados inseridos pelo usuário no aplicativo antes de serem enviados ao backend.
* **Criptografia de Dados Sensíveis:** Uso de módulos nativos ou bibliotecas confiáveis de React Native (ex: react-native-keychain ou Secure Storage APIs) para armazenar tokens, senhas e chaves localmente.
* **Controle de Sessão:** Monitoramento da validade dos JWTs tokens. Implementar a expiração automática e a funcionalidade de revalidação de token para manter a sessão ativa de forma segura, exigindo um novo login após a expiração.
* **Uso de HTTPS:** Garantir que todas as comunicações com o backend sejam feitas exclusivamente via HTTPS. Considerar a implementação de SSL Pinning para mitigar ataques Man-in-the-Middle (MITM), garantindo que o app só se comunique com o servidor esperado.

## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 1

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Introdução | 01/02/2024     | 07/02/2024 | ✔️    | 05/02/2024      |

#### Semana 2

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Página inicial   | 01/02/2024     | 07/03/2024 | ✔️    | 05/02/2024      |

#### Semana 3

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Página inicial   | 01/02/2024     | 07/03/2024 | ✔️    | 05/02/2024      |

#### Semana 4

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Página inicial   | 01/02/2024     | 07/03/2024 | ✔️    | 05/02/2024      |


Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

