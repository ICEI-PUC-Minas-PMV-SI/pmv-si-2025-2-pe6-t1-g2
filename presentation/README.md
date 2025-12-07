# Apresentação da Solução

## 📘 Saber+ — Plataforma de Conexão entre Alunos e Professores
A busca por professores particulares qualificados ainda é um processo difícil, fragmentado e pouco seguro. Falta uma plataforma centralizada que permita aos estudantes encontrar profissionais adequados, comparar valores e metodologias e e realizar agendamentos de forma prática.

Este projeto propõe a construção do Saber+, um ambiente digital capaz de conectar pessoas que desejam aprender a especialistas qualificados, oferecendo uma experiência personalizada, interativa e acessível para qualquer área de interesse.

## 🎯 Objetivos do Projeto
Desenvolver um ambiente de aprendizagem que conecte estudantes a especialistas qualificados, facilitando o desenvolvimento de habilidades de forma personalizada e acessível.
* Criar uma plataforma com busca e filtragem avançada para encontrar especialistas de diversas áreas, comparando qualificações, metodologias, preços e avaliações.
* Implementar perfis públicos personalizáveis para especialistas, funcionando como portfólios digitais com informações, experiências e avaliações dos alunos.

## 🛠️ Tecnologias Utilizadas
### Back-end / API
* ASP.NET Core
* Entity Framework
* SQL Server
* Swagger
* Insomnia

### Sistema Web
* HTML
* CSS
* JavaScript

### Aplicativo Mobile
* React Native
* TypeScript
* Node.js
* React Navigation
* AsyncStorage
* Metro + Babel
* ESLint + Prettier
* Jest
* Ngrok

## 🏗️ Processo de Desenvolvimento
O desenvolvimento da solução foi dividido em quatro etapas principais:

### 1. Preparação e Planejamento
* Definição do tema e problema a ser resolvido
* Criação das personas e público-alvo
* Levantamento dos requisitos funcionais e não funcionais
* Elaboração do catálogo de serviços
* Desenho da arquitetura da solução (modelo cliente-servidor)
  ![Arquitetura da Solução](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g2/raw/main/docs/img/arquitetura_solucao_saber_mais_3.png)

### 2. Construção da Web API
* Desenvolvimento da API usando ASP.NET Core
* Modelagem do banco de dados com Entity Framework
* Testes de requisições usando Insomnia
* Documentação completa dos endpoints via Swagger
* Criação dos endpoints para:
  * Agendamentos
  * Alunos
  * Áreas
  * Avaliações
  * Disponibilidades
  * Professores
  * Usuários
  * Autenticação
 ![API](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g2/blob/main/docs/img/api-saber%2B.png)

### 3. Desenvolvimento do Sistema Web
* Criação das telas no Figma
* Construção de todo o front-end em HTML, CSS e JavaScript
* Integração com a API para operações reais (CRUD, login, filtros, listagens etc.)
* Implementação das páginas de:
  * Cadastro de Alunos e Professores
  * Login dos usuários
  * Busca de professores com filtro
  * Perfis
  * Solicitação de agendamentos
  * Dashboard com acompanhamento de aulas
* Testes funcionais e validações
 ![Aplicação Web](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g2/blob/main/docs/img/aplica%C3%A7%C3%A3o-web.png)


### 4. Desenvolvimento da Aplicação Mobile
* Protótipos criados no Figma
* Construção das telas em React Native
* Configuração de navegação, armazenamento local e integrações
* Conexão com a API para funcionalidades como:
  * Cadastro de alunos e professores e login
  * Visualização e filtragem de professores
  * Solicitação e aceite de aulas
  * Gerenciamento de perfis
* Testes de usabilidade e comportamento
<div align="center">
<img src="https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g2/blob/main/docs/img/aplica%C3%A7%C3%A3o-mobile.jpg" width="250px" alt="Aplicação mobile do projeto Saber+">
</div>

## 🚀 Solução Final Entregue
A solução final contempla três artefatos principais:

### ✔ 1. Web API
API robusta que gerencia:
* Usuários
* Alunos
* Professores
* Autenticação dos usuários
* Áreas de professores
* Disponibilidade de professores
* Agendamentos de aulas
* Avaliações

### ✔ 2. Sistema Web Funcional
Permite que:
* Professores e alunos cadastrem seus perfis
* Professores exibam portfólios
* Alunos encontrem professores por nome, competências ou certificações
* Alunos solicitem aulas
* Professores aceitem ou recusem aulas
* Ambos acompanhem suas aulas em dashboards

### ✔ 3. Aplicativo Mobile
Com funcionalidades equivalentes ao sistema web, porém focado em praticidade e acessibilidade.

## 🎥 Vídeo Demonstrativo da Solução

* **Assista ao vídeo da solução**: https://drive.google.com/file/d/1RxjsXqU7MGZXLH-Zi5TwxWhXgXkTzXjx/view?usp=sharing <br>
* **Apresentação Final da Solução**: [Apresentação final - Saber+](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g2/blob/main/docs/img/APRESENTA%C3%87%C3%83O%20FINAL%20-%20SABER%2B.pdf)

