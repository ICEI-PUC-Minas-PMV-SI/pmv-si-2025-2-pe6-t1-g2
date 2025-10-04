# APIs e Web Services

O Projeto Saber Mais consiste em uma aplicação Web que oferece uma plataforma de conexão entre professores e alunos para agendamento de aulas particulares, avaliação de serviços e gerenciamento de disponibilidade. A API fornece endpoints para o gerenciamento de usuários, professores, áreas de atuação, disponibilidade, agendamentos e avaliações, permitindo a integração de múltiplos sistemas clientes (web, mobile, etc.).

## Objetivos da API

A API do Projeto Saber Mais foi desenvolvida para fornecer uma interface robusta e segura que permita o gerenciamento eficiente de usuários, professores, áreas de conhecimento, disponibilidades, agendamentos e avaliações. Os principais objetivos desta API são:

- **Facilitar a integração** entre diferentes clientes (web, aplicativos móveis, etc.) eo backend da plataforma, garantindo comunicação consistente e eficiente.
- **Garantir a segurança** dos dados dos usuários incluindo informações pessoais e agendamentos.
- **Oferecer funcionalidades CRUD completas** para todos os recursos essenciais do sistema, como cadastro de usuários, professores, áreas de atuação, horários disponíveis, agendamentos e avaliações.
- **Suportar futuros aprimoramentos e integrações**, como autenticação, autorização, notificações e relatórios.

## Modelagem da Aplicação
A modelagem da aplicação "Saber+" foi concebida para estruturar um sistema de agendamento de aulas e avaliações entre alunos e professores. A representação visual dessa estrutura foi consolidada através de um Diagrama de Classes, que detalha as entidades centrais do sistema, seus atributos, comportamentos e as relações entre elas. Este diagrama é fundamental para compreender a organização dos dados e a lógica de negócio que governa a plataforma.

<img src="./img/Diagrama de Classes - Projeto Saber+ (2).png" alt="Diagrama de Classes do projeto Saber+">

## Tecnologias Utilizadas

Para o desenvolvimento da API do Projeto Saber Mais, foram escolhidas tecnologias modernas e consolidadas que garantem desempenho, segurança e facilidade de manutenção. As principais tecnologias utilizadas são:

- **Entity Framework Core**: ORM (Object-Relational Mapper) utilizado para o mapeamento das entidades do sistema ao banco de dados, facilitando operações CRUD e consultas complexas.
- **SQL Server**: Sistema gerenciador de banco de dados relacional usado para armazenar os dados da aplicação de forma segura e estruturada.
- **ASP .NET Core Web API**: Framework para criação de APIs RESTful, com suporte nativo para rotas, controllers, validação, e segurança.
- **Swagger/OpenAPI**: Ferramenta para documentação automática da API, permitindo que desenvolvedores conheçam os endpoints disponíveis, parâmetros e respostas.
- **Insomnia**: Cliente REST utilizado para testar os endpoints da API durante o desenvolvimento, facilitando a simulação de requisições HTTP e análise de respostas.
- **Visual Studio**: IDEs utilizadas para o desenvolvimento, debug e testes da aplicação.
- **Git e GitHub**: Para controle de versão e colaboração entre desenvolvedores. 

## API Endpoints

[Liste os principais endpoints da API, incluindo as operações disponíveis, os parâmetros esperados e as respostas retornadas.]

### Endpoint 1
- Método: GET
- URL: /endpoint1
- Parâmetros:
  - param1: [descrição]
- Resposta:
  - Sucesso (200 OK)
    ```
    {
      "message": "Success",
      "data": {
        ...
      }
    }
    ```
  - Erro (4XX, 5XX)
    ```
    {
      "message": "Error",
      "error": {
        ...
      }
    }
    ```
  ### Criar Professor
- **Método:** POST  
- **URL:** /api/Professores  
- **Parâmetros (body JSON):**
  - `usuarioId`: ID do usuário que será professor (int)  
  - `descricao`: Descrição ou especialidade do professor (string)  
- **Resposta:**  
  - **Sucesso (201 Created)**
    ```json
    {
      "id": 1,
      "usuarioId": 1,
      "descricao": "Professor de Matemática",
      "certificacoes": [],
      "competencias": []
    }

  
  ### Criar Agendamento
- **Método:** POST  
- **URL:** /api/Agendamentos  
- **Parâmetros (body JSON):**
  - `alunoId`: ID do aluno que está agendando (int)  
  - `professorId`: ID do professor (int)  
  - `data`: Data do agendamento (string, formato ISO 8601)  
  - `horaInicio`: Hora de início (string, HH:mm)  
  - `horaFim`: Hora de término (string, HH:mm)  
- **Resposta:**  
  - **Sucesso (201 Created)**
    ```json
    {
      "id": 1,
      "alunoId": 5,
      "professorId": 1,
      "data": "2025-10-05",
      "horaInicio": "08:00",
      "horaFim": "09:00"
    }

## Considerações de Segurança

[Discuta as considerações de segurança relevantes para a aplicação distribuída, como autenticação, autorização, proteção contra ataques, etc.]

## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

## Casos de Testes - Requisitos Funcionais

| **ID**     | **Requisito**                 | **Objetivo**                                                              | **Pré-condição** | **Passos** | **Resultado Esperado** | **Prioridade** |
| :--------- | :---------------------------- | :------------------------------------------------------------------------ | :--------------- | :--------- | :-------------------- | :------------: |
| CT-RF-001  | RF-001 – Gerenciar usuários   | Garantir que seja possível criar, editar, listar e excluir usuários       | A DEFINIR        | A DEFINIR  | A DEFINIR             | ALTA           |
| CT-RF-002  | RF-002 – Gerenciar instrutor  | Garantir que seja possível criar, editar, listar e excluir instrutores    | Sistema iniciado e usuário autenticado como admin | 1. `POST /instrutores`<br>2. `PUT /instrutores/{id}`<br>3. `GET /instrutores`<br>4. `DELETE /instrutores/{id}` | Instrutor é criado, editado, listado e excluído com sucesso | ALTA |
| CT-RF-003  | RF-003 – Consultar instrutores | Garantir que usuários consigam buscar e visualizar detalhes de instrutores | Sistema iniciado | 1. `GET /instrutores`<br>2. `GET /instrutores?search=nome`<br>3. `GET /instrutores/{id}` | Instrutores filtrados corretamente e detalhes exibidos | ALTA |
| CT-RF-004  | RF-004 – Gerenciar agendamento | Garantir que usuários consigam criar, alterar e cancelar agendamentos      | Usuário autenticado | 1. `POST /agendamentos`<br>2. `PUT /agendamentos/{id}`<br>3. `DELETE /agendamentos/{id}` | Agendamento criado, alterado ou cancelado com sucesso; conflitos de horário são evitados | ALTA |
| CT-RF-005  | RF-005 – Gerenciar avaliações | Garantir que usuários possam avaliar instrutores ou serem avaliados       | A DEFINIR        | A DEFINIR  | A DEFINIR             | MÉDIA          |

## Casos de Testes - Requisitos Não Funcionais

| **ID**         | **Requisito**                             | **Objetivo**                                               | **Pré-condição** | **Passos**   | **Resultado Esperado** | **Prioridade** |
| :------------- | :--------------------------------------- | :--------------------------------------------------------- | :--------------- | :----------- | :-------------------- | :------------: |
| CT-RNF-001     | RNF-001 – Responsividade                  | Garantir que a interface se adapte a diferentes dispositivos | Sistema iniciado  | 1. Abrir sistema em desktop, tablet e smartphone | Interface se adapta corretamente sem quebrar layout | ALTO           |
| CT-RNF-002     | RNF-002 – LGPD                            | Garantir conformidade com LGPD                             | Usuário autenticado | 1. Criar usuário com dados pessoais<br>2. Solicitar exclusão de dados | Dados pessoais são tratados conforme LGPD e podem ser excluídos | ALTO           |
| CT-RNF-003     | RNF-003 – HTTPS                           | Garantir comunicação segura                                | A DEFINIR         | A DEFINIR    | A DEFINIR             | ALTO           |
| CT-RNF-004     | RNF-004 – Senhas criptografadas           | Garantir segurança das senhas                              | A DEFINIR         | A DEFINIR    | A DEFINIR             | ALTO           |
| CT-RNF-005     | RNF-005 – Compatibilidade navegadores     | Garantir funcionamento nos principais navegadores         | Sistema publicado  | 1. Acessar sistema em Chrome, Edge, Firefox, Safari e Opera | Sistema funciona corretamente em todos os navegadores | MÉDIA          |
| CT-RNF-006     | RNF-006 – Compatibilidade sistemas móveis | Garantir funcionamento em Android e iOS                    | A DEFINIR         | A DEFINIR    | A DEFINIR             | MÉDIA          |



3. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
4. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
5. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
6. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 1

Atualizado em: 12/09/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Todos do grupo (em reunião) | Definição de próximos passos e distribuição das tarefas entre os integrantes.| 01/09/2025   | 01/09/2025 | ✔️    | 01/09/2025    |


#### Semana 2

Atualizado em: 12/09/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Laís Lara, Antônio Rubens e Sávio Sérgio  | Criação, desenvolvimento e revisão da apresentação da etapa 1.  | 03/09/2025   | 08/09/2025 | ✔️ | 08/09/2025  |
| Laís Lara e Antônio Rubens | Apresentação da etapa 1.  | 08/09/2025   | 08/09/2025 | ✔️ | 08/09/2025  |
| Laís Lara, Beatriz Pereira e Sávio Sérgio | Elaboração do Diagrama de Classes do projeto | 10/09/2025 | 14/09/2025 | ✔️  |              12/09/2025 |
| Laís Lara e Beatriz Pereira | Criação da API do projeto | 12/09/2025 | 16/09/2025 | 📝  |     |

#### Semana 5

Atualizado em 04/09/2025
| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Antônio Rubens  | Teste de API.  | 04/10/2025   | 05/10/2025 | 📝 | 05/10/2025  |




Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

