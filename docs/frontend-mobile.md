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

 <p align="center"><img src="img/Diagrama.jpg" width="900" alt="Diagrama"></p>

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

### Caso de teste: Cadastrar Aluno
* Entrada: Nome, E-mail, Senha, Confirmar senha, CPF e descrição
* Resposta esperada: Cadastro realizado com sucesso!
* Evidência:

### Caso de teste: Cadastrar Professor
* Entrada: Nome completo, E-mail, Senha, CPF, Descrição, Certificações, Competências e Valor da hora-aula.
* Resposta esperada: Cadastro criado com suvesso e direcionamento para o login.
* Evidência:

### Caso de teste: Login Usuário
* Entrada: E-mail e senha de usuário já cadastrado na plataforma.
* Resposta esperada: Mensagem de login realizado com sucesso e direcionamento para a homepage.
* Evidência:

### Caso de teste: Editar Perfil de Usuário do tipo Professor
* Entrada: Inserir os dados que deseja alterar, como nome, e-mail, descrição, certificações, competências, valor da hora-aula, áreas de atuação ou horários disponíveis e senha (para confirmação).
* Resposta esperada: Mensagem de sucesso e dados alterados no banco de dados.

### Caso de teste: Editar Perfil de Usuário do tipo Aluno
* Entrada: Inserir os dados que deseja alterar, como nome, e-mail, descrição e senha (para confirmação).
* Resposta esperada: Mensagem de sucesso e dados alterados no banco de dados.

### Caso de teste: Filtrar Professor por Área ou Nome durante a busca
* Entrada: Acessar a tela de "Buscar Professor" e inserir nome, disciplina ou habilidade esperada.
* Resposta esperada: Aplicação do filtro na listagem e atualizar lista com professores que atendam o requisito.
* Evidência:

### Caso de teste: Registrar Agendamento
* Entrada: Escolher professor da listagem, clicar em "agendar", inserir data, horário e conteúdo da aula e clicar em "Confirmar Agendamento".
* Resposta esperada: Mensagem de sucesso e agendamento registrado no banco de dados.
* Evidência:
  
# Referências

- https://reactnative.dev/
- https://pt-br.legacy.reactjs.org/
- https://pucminas.instructure.com/courses/155666 - Eixo 6 - Microfundamento: Desenvolvimento de Aplicações Móveis
- https://dashboard.ngrok.com/get-started/setup/windows

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

