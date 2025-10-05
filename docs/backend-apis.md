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

<img src="./img/Diagrama_de_Classe-Projeto_Saber+.png" width="600px" alt="Diagrama de Classes do projeto Saber+">

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

### Autenticar Usuário
- Método: POST
- URL: /api/Usuarios/Authenticate
- Parâmetros (body JSON):
  - `id`: ID do usuário que deseja se autenticar (int)  
  - `password`: senha feita em seu cadastro (string) 
- Resposta:
  - Sucesso (200 OK)
    ```json
    {
      "jwtToken": "string" // Token JWT gerado
    }
    ```
  - Erro (401 Unauthorized)
    ```json
    {
      "message": "ID ou senha inválidos"
    }
    ```
<img src="./img/EndPoints-POST-Authenticate-Usuários.png" alt="Endpoint de autenticação de Usuários">


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
<img src="./img/EndPoints-GET-Criar-Professor.png" alt="Endpoint de criação de professor">
  
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
<img src="./img/EndPoints-GET-Criar-Agendamento.png" alt="Endpoint de criação de agendamento">

Adicionalmente aos três endpoints detalhados, a API implementa um conjunto padrão de endpoints RESTful (GET, POST, PUT, DELETE) para o gerenciamento dos demais recursos. As imagens a seguir, extraídas da interface Swagger, ilustram a estrutura desses endpoints para `Agendamentos`, `Áreas`, `Avaliações`, `Disponibilidades`, `Professores` e `Usuários`.

<img src="./img/Endpoints-Agendamentos-Áreas.png" alt="Endpoint de Agendamentos e Áreas">
<img src="./img/Endpoints-Avaliações-Disponibilidades.png" alt="Endpoint de Avaliações e Disponibilidades">
<img src="./img/Endpoints-Professores.png" alt="Endpoint de Professores">
<img src="./img/Endpoints-Usuários.png" alt="Endpoint de Usuários">


## Considerações de Segurança

A aplicação de agendamento de aulas funciona apenas com conexão segura (HTTPS). O acesso é feito por login em um serviço de identidade confiável; após entrar, o usuário recebe um “token” de acesso com validade curta. No app de celular, esse token é guardado em área segura do aparelho. Quando necessário, pode-se exigir confirmação em dois passos para ações sensíveis (por exemplo, alterar dados da conta).

A autorização é baseada em perfis e regras claras. Existem perfis como Aluno, Professor e Administrador, cada um com permissões específicas. Em toda solicitação o sistema verifica se a pessoa tem permissão para aquela ação e se é a “dona” do recurso (ex.: só o professor pode confirmar/cancelar seus próprios horários). As telas e as respostas da API mostram apenas as informações estritamente necessárias a cada perfil.

Para proteção contra ataques, aplicamos limites de uso por usuário e por endereço de rede, bloqueando tentativas repetidas e abusos (como criação massiva de agendamentos). Todas as entradas são validadas para evitar erros e fraudes; consultas ao banco usam parâmetros para impedir injeção de comandos. Se houver uso de cookies no site, eles são marcados como seguros e protegidos contra uso indevido. Envio de arquivos (como material de aula) passa por checagem de tipo e tamanho. O tráfego entre cliente e servidor é sempre criptografado e os dados sensíveis são armazenados de forma protegida. Por fim, eventos importantes (logins, tentativas negadas, criação/alteração/cancelamento de agendamentos) são registrados e monitorados para permitir detecção rápida e resposta a incidentes.

## Implantação
A implantação em produção parte de uma base clara de requisitos. Para a aplicação, começamos com duas instâncias de API, cada uma com cerca de 1 vCPU e 2 GB de memória, garantindo alta disponibilidade e espaço para crescer conforme a demanda. O armazenamento de 20 GB por instância é suficiente para logs temporários e arquivos de trabalho. No banco de dados SQL Server gerenciado com capacidade aproximada de 2 vCPUs e 8 GB de memória, já configurado com alta disponibilidade entre zonas e backups automáticos. Do lado do software, a aplicação é construída com .NET (9), usa Entity Framework Core para acesso ao banco e publica artefatos prontos para execução; quando trabalhamos com contêineres, o Docker empacota a aplicação e a AWS CLI cuida das interações com a nuvem.

A plataforma escolhida é a AWS, combinando um balanceador de carga para receber o tráfego HTTPS com a execução da API em contêineres sem servidor e um SQL Server gerenciado (Amazon RDS). Essa composição reduz a sobrecarga operacional  cuida do sistemas operacional ou patches de banco — e facilita a escalabilidade conforme as rotas de busca de professores e os picos de agendamento crescem. O tráfego de entrada é encerrado em HTTPS no balanceador, usando certificados emitidos e renovados automaticamente, e segue por uma rede privada até as tarefas da API ao banco.

Antes do primeiro deploy, o ambiente é preparado com redes separando o que é público (balanceador) do que é privado (API e banco). As regras de segurança permitem que a internet acesse apenas a porta segura do balanceador; a API responde somente a esse balanceador; e o banco aceita conexões apenas da API, na porta específica do SQL Server. Segredos como a senha do banco e chaves de serviço não ficam no código: são guardados em um cofre de segredos e injetados na aplicação por variáveis de ambiente. A própria aplicação lê a cadeia de conexão do banco a partir desses segredos e publica, quando necessário, endereços temporários para upload de materiais por professores, mantendo os arquivos em um armazenamento de objetos privado.

O processo de publicação é simples e repetível. Em projetos sem contêiner, a aplicação é compilada em modo de release e os artefatos resultantes são levados ao serviço de aplicação, que é registrado atrás do balanceador. Em projetos com contêiner à imagem da API é construída localmente, enviada a um registro de imagens e referenciada por uma definição de tarefa. O serviço de execução é então atualizado para apontar para a nova versão, mantendo instâncias antigas até que as verificações de saúde confirmem que a nova versão está pronta. Esse fluxo permite trocas graduais ou até abordagens blue/green, nas quais a nova versão é validada antes de receber todo o tráfego.

As mudanças do banco são aplicadas junto com o deploy. As migrações do Entity Framework garantem que a estrutura do SQL Server acompanhe a evolução do código sem intervenções manuais arriscadas. É recomendável executar essas migrações como um passo dedicado da publicação, usando as mesmas credenciais que a aplicação usará em produção, e sempre registrar o resultado para auditoria. Caso haja necessidade de voltar atrás, mantemos a imagem estável anterior à mão e contamos com backups e pontos de restauração do banco.

Depois de disponibilizar a nova versão, realizamos testes práticos no próprio ambiente de produção. Verificamos um endereço de saúde simples, acessamos a documentação dos endpoints e exercitamos os fluxos críticos: login no aplicativo, pesquisa de professores, criação de um agendamento pelo aluno, confirmação pelo professor e, quando aplicável, o envio e a recuperação de materiais. Conferimos se apenas HTTPS está ativo, se as origens do aplicativo têm permissão de acesso, se respostas sem autorização retornam os códigos adequados e se limites de requisição contêm acessos excessivos. Por fim, acompanhamos logs e métricas do balanceador e do serviço para garantir que erros e latência estão sob controle.

## Testes

## Casos de Testes - Requisitos Funcionais

| **ID**     | **Requisito**                 | **Objetivo**                                                              | **Pré-condição** | **Passos** | **Resultado Esperado** | **Prioridade** |
| :--------- | :---------------------------- | :------------------------------------------------------------------------ | :--------------- | :--------- | :-------------------- | :------------: |
| CT-RF-001  | RF-001 – Gerenciar usuários   | Garantir que seja possível listar todos os usuários cadastrados, criar, editar, listar determinado usuários e exclui-los   | Sistema iniciado e usuário autenticado como admin   | 1. `GET /api/Usuarios`<br>2. `POST /api/Usuarios`<br> 3. `GET /api/Usuarios/{id}`<br>4.`PUT /api/Usuarios/{id}`<br>5. `DELETE api/Usuarios/{id}`<br>6.`POST /api/Usuarios/Authenticate`  | Usuário é criado, editado, listado e excluído com sucesso    | ALTA           |
| CT-RF-002  | RF-002 – Gerenciar instrutor  | Garantir que seja possível criar, editar, listar e excluir instrutores    | Sistema iniciado e usuário autenticado como admin | 1. `POST /professores`<br>2. `PUT /professores/{id}`<br>3. `GET /professores`<br>4. `DELETE /professores/{id}` | Instrutor é criado, editado, listado e excluído com sucesso | ALTA |
| CT-RF-003  | RF-003 – Consultar instrutores | Garantir que usuários consigam buscar e visualizar detalhes de instrutores | Sistema iniciado | 1. `GET /professores`<br><br>2. `GET /professores/{id}` | professores filtrados corretamente e detalhes exibidos | ALTA |
| CT-RF-004  | RF-004 – Gerenciar agendamento | Garantir que usuários consigam criar, alterar e cancelar agendamentos      | Usuário autenticado | 1. `POST /agendamentos`<br>2. `PUT /agendamentos/{id}`<br>3. `DELETE /agendamentos/{id}` | Agendamento criado, alterado ou cancelado com sucesso; conflitos de horário são evitados | ALTA |
| CT-RF-005  | RF-005 – Gerenciar avaliações | Garantir que usuários possam avaliar instrutores ou serem avaliados       | Sistema iniciado e usuário autenticado como admin | 1. `GET /api/Avaliacoes`<br>2. `POST /api/Avaliacoes`<br> 3. `GET /api/Avaliacoes/{id}`<br>4.`PUT /api/Avaliacoes/{id}`<br>5. `DELETE api/Avaliacoes/{id}` | Avaliação é criada, editada, listada e excluída com sucesso    | MÉDIA          |

## Casos de Testes - Requisitos Não Funcionais

| **ID**         | **Requisito**                             | **Objetivo**                                               | **Pré-condição** | **Passos**   | **Resultado Esperado** | **Prioridade** |
| :------------- | :--------------------------------------- | :--------------------------------------------------------- | :--------------- | :----------- | :-------------------- | :------------: |
| CT-RNF-001     | RNF-001 – Responsividade                  | Garantir que a interface se adapte a diferentes dispositivos | Sistema iniciado  | 1. Abrir sistema em desktop, tablet e smartphone | Interface se adapta corretamente sem quebrar layout | ALTO           |
| CT-RNF-002     | RNF-002 – LGPD                            | Garantir conformidade com LGPD                             | Usuário autenticado | 1. Criar usuário com dados pessoais<br>2. Solicitar exclusão de dados | Dados pessoais são tratados conforme LGPD e podem ser excluídos | ALTO           |
| CT-RNF-003     | RNF-003 – HTTPS                           | Garantir comunicação segura                                | Servidor web configurado com certificado SSL/TLS (HTTPS) ativo.         |   1. Acessar qualquer endpoint da API utilizando `https://` no lugar de `http://`.  <br><br>2. Verificar se a conexão é segura (cadeado no navegador ou no Insomnia/Postman).   | Todas as requisições devem ser transmitidas via HTTPS e sem avisos de segurança.            | ALTO           |
| CT-RNF-004     | RNF-004 – Senhas criptografadas           | Garantir segurança das senhas                              | Usuário já registrado no sistema         | 1. Criar novo usuário com senha em texto simples (POST /usuarios).<br><br>2. Verificar no banco de dados se a senha foi armazenada de forma criptografada (hash).<br><br>3. Tentar autenticar usando a senha correta e verificar se o login funciona.    | 1. Senha armazenada no banco não deve ser legível (hash). <br><br>2. Login deve funcionar corretamente usando a senha original.             | ALTO           |
| CT-RNF-005     | RNF-005 – Compatibilidade navegadores     | Garantir funcionamento nos principais navegadores         | Sistema publicado  | 1. Acessar sistema em Chrome, Edge, Firefox, Safari e Opera | Sistema funciona corretamente em todos os navegadores | MÉDIA          |
| CT-RNF-006     | RNF-006 – Compatibilidade sistemas móveis | Garantir funcionamento em Android e iOS                    | A DEFINIR         | A DEFINIR    | A DEFINIR             | MÉDIA          |

# Casos de Teste - Insomnia

## Professores

- **GET /professores/**  
  Lista todos os professores  
  ✅ Teste: Válido
  
  <img width="1110" height="495" alt="get - professores - ok" src="https://github.com/user-attachments/assets/4d5adf77-6bfe-4eeb-84b9-63d907410133" />

- **POST /professores/**  
  Cria um novo professor  
  ✅ Teste: Válido

  <img width="1112" height="491" alt="post - professores - ok" src="https://github.com/user-attachments/assets/32b84c11-f64e-4c78-b730-1e06513c88d9" />

- **PUT /professores/{id}**  
  Atualiza um professor existente  
  ✅ Teste: Válido

  <img width="1112" height="280" alt="put - professores - ok" src="https://github.com/user-attachments/assets/c3dddd02-d37c-495f-9e4d-013cc7c09ade" />


- **DELETE /professores/{id}**  
  Remove um professor  
  ✅ Teste: Válido

  <img width="1115" height="262" alt="delete - professores - ok" src="https://github.com/user-attachments/assets/aa59b30b-6ca3-41a6-bfc1-415bf13275aa" />

  ## Agendamentos

- **GET /agendamentos/**  
  Lista todos os agendamentos  
  ✅ Teste: Válido

  <img width="1110" height="743" alt="get - agendamentos - ok" src="https://github.com/user-attachments/assets/998c0872-79e7-4d1e-a08c-aed0c5a1fed0" />


- **POST /agendamentos/**  
  Cria um novo agendamento  
  ✅ Teste: Válido

  <img width="1110" height="334" alt="post - agendamentos - ok" src="https://github.com/user-attachments/assets/7dd0745c-4d42-4efb-bc23-7b3bb2cdf609" />

- **PUT /agendamentos/{id}**  
  Atualiza um agendamento existente  
  ✅ Teste: Válido

  <img width="1112" height="305" alt="put - agendamentos - ok" src="https://github.com/user-attachments/assets/28c6b318-2d82-4f9d-b58b-5ba5197d9747" />

- **DELETE /agendamentos/{id}**  
  Remove um agendamento  
  ✅ Teste: Válido
  
  <img width="1111" height="265" alt="delete - agendamentod - ok" src="https://github.com/user-attachments/assets/c8c516ef-6bb3-4bba-8e5e-2895ac082ed1" />

## Disponibilidades

- **GET /disponibilidades/**  
  Lista todas as disponibilidades  
  ✅ Teste: Válido

  <img width="1115" height="719" alt="get - disponibilidades - ok" src="https://github.com/user-attachments/assets/d8c01f2b-7c2d-43d8-98ce-40a806260f9e" />

- **POST /disponibilidades/**  
  Cria uma nova disponibilidade  
  ✅ Teste: Válido
  
  <img width="1113" height="329" alt="post - disponibilidades - ok" src="https://github.com/user-attachments/assets/94d08110-dc30-4173-9df4-fc4d94d4fd08" />

- **PUT /disponibilidades/{id}**  
  Atualiza uma disponibilidade existente  
  ✅ Teste: Válido

  <img width="1114" height="292" alt="put - disponibilidades - ok" src="https://github.com/user-attachments/assets/ce4cae58-1f43-4b1d-9279-3cac72f11ace" />

- **DELETE /disponibilidades/{id}**  
  Remove uma disponibilidade  
  ✅ Teste: Válido

  <img width="1113" height="294" alt="delete - disponibilidades - ok" src="https://github.com/user-attachments/assets/43101bf1-7faf-4fd9-b74e-2524612515be" />

3. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
4. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
5. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
6. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.

# Planejamento

##  Quadro de tarefas

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
| Laís Lara e Beatriz Pereira | Início da Criação da API do projeto | 12/09/2025 | 16/09/2025 | ✔️  |  04/10/2025   |


### Semana 3

Atualizado em: 05/10/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Laís Lara Ferreira dos Santos | Criação e configuração das classes e controllers de "Usuário", "Avaliações" e "Áreas"| 15/09/2025   | 21/09/2025 | ✔️    | 21/09/2025    |
| Beatriz Pereira da Costa | Criação e configuração das classes e controllers de "Professores", "Agendamentos" e "Disponibilidade"| 15/09/2025   | 21/09/2025 | ✔️    | 21/09/2025    |


### Semana 4

Atualizado em: 05/10/2025
| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Laís Lara Ferreira dos Santos | Configuração da relação muitos para muitos entre professor e área | 22/09/2025   | 28/09/2025 | ✔️    | 28/09/2025    |
| Beatriz Pereira da Costa | Correções da classe "Professor" | 22/09/2025   | 28/09/2025 | ✔️    | 28/09/2025    |



#### Semana 5

Atualizado em 04/09/2025
| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Laís Lara Ferreira dos Santos | Configuração da autenticação do projeto | 29/09/2025   | 03/10/2025 | ✔️    | 03/10/2025    |
| Beatriz Pereira da Costa | Configuração da autorização do projeto | 29/09/2025   | 03/10/2025 | ✔️    | 03/10/2025    |
| Beatriz Pereira da Costa | Descrição dos End-points e tabela de testes de requisitos do projeto | 03/10/2025   | 05/10/2025 | ✔️    | 04/10/2025    |
| Antônio Rubens  | Teste de API. e apoio na elaboração da documentação  | 04/10/2025   | 05/10/2025 | 📝 | 05/10/2025  |
| Denis Alves da Silva Leite  | Teste de API  | 04/10/2025   | 05/10/2025 | ✔️  | 05/10/2025  |




Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

