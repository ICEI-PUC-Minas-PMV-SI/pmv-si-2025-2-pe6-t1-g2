# Introdução

Texto descritivo com a visão geral do projeto abordado. Inclui o contexto, o problema, os objetivos, a justificativa e o público-alvo do projeto.

## Problema
A busca por professores particulares qualificados é uma tarefa desafiadora. A dificuldade de aprendizado em ambientes tradicionais de sala de aula e a carência de habilidades autodidatas impulsionam a necessidade crescente por apoio educacional individualizado. No entanto, estudantes e pais enfrentam a dificuldade de encontrar profissionais adequados, comparar valores e avaliar a credibilidade e as recomendações de cada um. Essa falta de uma plataforma centralizada para pesquisa e agendamento resulta em um processo ineficiente, fragmentado e, muitas vezes, inseguro. O problema reside, portanto, na inexistência de uma solução que conecte de forma simples e direta a demanda por ensino particular à oferta de profissionais qualificados.


## Objetivos
- Objetivo geral
  
Construir um ambiente de aprendizagem com o intuito de conectar pessoas em busca de conhecimento a especialistas qualificados, facilitando o desenvolvimento de habilidades de forma personalizada, interativa e acessível para qualquer área de interesse.

 - Objetivos específicos
 
Criar uma plataforma de busca e filtragem avançada que facilite os usuários encontrar especialistas em uma vasta gama de áreas (acadêmicas, profissionais, hobbies, etc.), podendo comparar por qualificação, metodologia, preço e avaliações.

Oferecer perfis públicos e personalizáveis para os especialistas, que funcionem como um portfólio digital, permitindo-lhes divulgar seu trabalho, metodologia, experiência e receber avaliações que construam sua reputação na plataforma.

## Justificativa

A proposta deste tema surge a partir da crescente demanda por alternativas flexíveis de ensino, especialmente no contexto pós-pandemia, em que a educação remota e o aprendizado autônomo ganharam destaque. Além disso, busca-se fomentar o conhecimento para além da sala de aula, incentivando o aluno a explorar outras formas de aprendizagem quando o ensino tradicional não for suficiente ou quando o seu processo de aprendizado exigir maior investimento.

A aplicação proposta tem como objetivo facilitar a conexão entre alunos e professores particulares, permitindo que os usuários encontrem profissionais qualificados conforme suas áreas de interesse, disponibilidade de horários e metas específicas. A solução pretende oferecer um ambiente intuitivo e eficiente para a contratação de aulas, promovendo a acessibilidade, a autonomia no aprendizado e a valorização do ensino individualizado.

> **Links Úteis**:
> - [Como montar a justificativa](https://guiadamonografia.com.br/como-montar-justificativa-do-tcc/)

## Público-Alvo

O público-alvo da plataforma é formado principalmente por dois perfis complementares:

- **Alunos:** 
Todo os tipos de pessoas que tem alguma necessidade, entusiasmo ou interessados em adquirir conhecimentos, habilidades e desenvolver competências para a vida profissional ou para satisfazer suas necessidades próprias. São usuários que já possuem certa familiaridade com tecnologia, utilizam dispositivos móveis e plataformas digitais no dia a dia e valorizam a possibilidade de escolher, de acordo com seus critérios, horário das aulas, preço e estilo de ensino, área de conhecimento e o programa de ensino.
- **Professores:** 
Profissionais autônomos, tutores e especialistas em diferentes áreas, que desejam iniciar ou ampliar a divulgação de seus serviços e sua rede de alunos. Ativos em redes sociais, com domínio digital que varia de básico a intermediário. Valorizam a possibilidade de alcançar públicos mais amplos, aumentar sua credibilidade por meio de avaliações e consolidar sua atividade como uma fonte de renda.

### Mapa de stakeholders:

| Stakeholders | Nível de Interesse |
|--------------|---------------------|
| Alunos       | Alto                |
| Professores  | Alto                |
| Administradores do sistema  | Alto                |
| Pais e responsáveis  | Alto                |
| Investidores  | Alto                |
| Desenvolvedores  | Alto                |

Adicione informações sobre o público-alvo por meio de uma descrição textual, diagramas de personas e mapa de stakeholders.

> **Links Úteis**:
> - [Público-alvo](https://blog.hotmart.com/pt-br/publico-alvo/)
> - [Como definir o público alvo](https://exame.com/pme/5-dicas-essenciais-para-definir-o-publico-alvo-do-seu-negocio/)
> - [Público-alvo: o que é, tipos, como definir seu público e exemplos](https://klickpages.com.br/blog/publico-alvo-o-que-e/)
> - [Qual a diferença entre público-alvo e persona?](https://rockcontent.com/blog/diferenca-publico-alvo-e-persona/)

# Especificações do Projeto

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Gerenciar prestador de serviço | ALTA | 
|RF-002| Gerenciar curriculo   | MÉDIA |
|RF-003| Gerenciar administrador   | ALTA |
|RF-004| Gerenciar usuários   | MÉDIA |
|RF-005| Gerenciar comentários   | MÉDIA |
|RF-006| Gerenciar avaliações   | MÉDIA |
|RF-007| Avaliar denúncias   | MÉDIA |
|RF-008| Gerenciar publicação   | MÉDIA |
|RF-009| Buscar por filtro   | MÉDIA |
|RF-010| Gerenciar preferências   | MÉDIA |
|RF-011| Logar no sistema   | MÉDIA |
|RF-012| Pontuar usuários   | MÉDIA |
|RF-013| Agendamento de aulas   | MÉDIA |

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve ser responsivo para rodar em um dispositivos móvel | MÉDIA | 
|RNF-002| Deve processar requisições do usuário em no máximo 2s |  BAIXA |
|RNF-003| Sistem deve comportar 10000 usuários simultaneamente |  BAIXA |
|RNF-004| Sistema deve seguir as normas da LGPD |  ALTO |
|RNF-005| Rodar nos sistemas de windows, linux ou mac |  BAIXA |
|RNF-006| Rodar em dispositivos móveis tendo uma boa diagramação de páginas |  BAIXA |
|RNF-007| O sistema deverá funcionar nos navegadores Safari Google Chrome, Microdoft Edge, Firefox e Opera |  BAIXA |
|RNF-008| O produto deve restringir o acesso por meio de senha individual para usuário |  BAIXA |





Com base nas Histórias de Usuário, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos Funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
 correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos Não Funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).
Lembre-se que cada requisito deve corresponder à uma e somente uma
característica alvo da sua solução. Além disso, certifique-se de que
todos os aspectos capturados nas Histórias de Usuário foram cobertos.

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

# Catálogo de Serviços

Descreva aqui todos os serviços que serão disponibilizados pelo seu projeto, detalhando suas características e funcionalidades.

# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![arq](https://github.com/user-attachments/assets/b9402e05-8445-47c3-9d47-f11696e38a3d)


## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 1

Atualizado em: 20/08/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Introdução | 01/02/2024     | 07/02/2024 |     |       |
| Laís Lara Ferreira dos Santos | Problema | 20/08/2025     | 22/08/2025 | ✔️    | 20/08/2025      |
| AlunaZ        | Objetivos    | 03/02/2024     | 10/02/2024 | 📝    |                 |
| AlunoY        | Histórias de usuário  | 01/01/2024     | 07/01/2005 | ⌛     |                 |
| AlunoK        | Personas 1  |    01/01/2024        | 12/02/2005 | ❌    |       |

#### Semana 2

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Página inicial   | 01/02/2024     | 07/03/2024 | ✔️    | 05/02/2024      |
| AlunaZ        | CSS unificado    | 03/02/2024     | 10/03/2024 | 📝    |                 |
| AlunoY        | Página de login  | 01/02/2024     | 07/03/2024 | ⌛     |                 |
| AlunoK        | Script de login  |  01/01/2024    | 12/03/2024 | ❌    |       |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado
