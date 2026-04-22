# VERBUM - Sistema de Aluguel de Carros

Sistema web desenvolvido em Java/Spring Boot com frontend React + Vite, organizado em arquitetura MVC. O projeto contempla autenticacao de usuarios, CRUD de clientes e agentes, gestao de automoveis, fluxo de pedidos de aluguel e controle de contratos de credito e aluguel, seguindo a separacao entre `controller`, `service`, `repository` e `model`.

![Status](https://img.shields.io/badge/status-pronto-2ea44f)
![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![H2](https://img.shields.io/badge/H2-Database-0B5FFF)
![Maven](https://img.shields.io/badge/Maven-Build-C71A36?logo=apachemaven&logoColor=white)

## Equipe e Integrantes

Integrantes:

- Arthur Goncalves
- Matheus Guilherme
- Miguel Moreira

Projeto academico desenvolvido para a disciplina de Engenharia de Software, com foco em modelagem, implementacao por camadas e integracao completa entre interface, API e banco de dados.

## Historias de Usuario

As historias abaixo representam o escopo funcional levantado para o sistema. A lista original tambem esta documentada em [docs/historias/HistoriasDeUsuario.md](./docs/historias/HistoriasDeUsuario.md).

### Cliente

- `HS01` - Como cliente, quero me cadastrar no sistema para acessar as funcionalidades de aluguel de automoveis.
- `HS02` - Como cliente, quero fazer login no sistema para acessar minha conta e gerenciar meus pedidos.
- `HS03` - Como cliente, quero recuperar minha senha informando meu e-mail para redefinir meu acesso ao sistema.
- `HS04` - Como cliente, quero criar um pedido de aluguel para solicitar um automovel.
- `HS05` - Como cliente, quero consultar meus pedidos para acompanhar o status do aluguel.
- `HS06` - Como cliente, quero modificar um pedido de aluguel para corrigir ou atualizar informacoes.
- `HS07` - Como cliente, quero cancelar um pedido de aluguel para desistir da solicitacao.

### Agente

- `HS08` - Como agente, quero fazer login no sistema para acessar os pedidos de aluguel.
- `HS09` - Como agente, quero avaliar pedidos de aluguel para analisar a viabilidade financeira do cliente.
- `HS10` - Como agente, quero aprovar pedidos de aluguel para permitir a execucao do contrato.
- `HS11` - Como agente, quero reprovar pedidos de aluguel para negar solicitacoes inviaveis.
- `HS12` - Como agente, quero modificar pedidos de aluguel para ajustar informacoes necessarias durante a analise.

### Especializacoes do Agente

- `HS13` - Como banco, quero analisar a situacao financeira do cliente para decidir sobre a concessao de credito.
- `HS14` - Como empresa, quero validar os dados do pedido de aluguel para garantir que estejam corretos antes da aprovacao.

### Sistema

- `HS15` - Como sistema, quero garantir que apenas usuarios cadastrados possam acessar as funcionalidades.
- `HS16` - Como sistema, quero armazenar os dados dos clientes, incluindo identificacao, profissao e rendimentos.
- `HS17` - Como sistema, quero gerenciar os dados dos automoveis disponiveis para aluguel.
- `HS18` - Como sistema, quero associar pedidos de aluguel a contratos de credito quando necessario.
- `HS19` - Como sistema, quero permitir que os pedidos sejam avaliados por agentes antes da aprovacao final.
- `HS20` - Como sistema, quero verificar a situacao financeira do cliente durante a avaliacao de pedidos.

## Implementacao Tecnica - Estado Atual

Esta secao descreve o que esta implementado no repositorio hoje. O escopo historico do projeto e mais amplo, mas os itens abaixo refletem o comportamento real da aplicacao nesta versao.

- Backend Spring Boot com arquitetura MVC e persistencia em H2.
- Frontend React com Vite consumindo a API por `fetch`.
- Landing page publica com busca visual de retirada/devolucao, vitrine de veiculos e CTA para autenticacao.
- Login unificado para cliente e agente.
- Cadastro de cliente com validacoes de nome, CPF, RG, login e empregadores.
- Cadastro de agente com suporte a `EMPRESA` e `BANCO`, incluindo validacao de CNPJ.
- CRUD completo de clientes.
- CRUD completo de agentes.
- CRUD de automoveis com controle de disponibilidade.
- Criacao, listagem, edicao, avaliacao, aprovacao, rejeicao e cancelamento de pedidos de aluguel.
- Contratos de credito e contratos de aluguel com operacoes de criacao, aprovacao, assinatura, encerramento e cancelamento.
- Sessao persistida no frontend via `localStorage`.
- Dados iniciais para testes locais criados automaticamente na primeira execucao.

## Arquitetura Geral

O projeto esta dividido em dois modulos principais:

```text
sistema-aluguel-carros/
|-- backend/              <- API Spring Boot (porta 8080)
|   |-- src/main/java/br/com/aluguelcarros/
|   |   |-- controller/
|   |   |-- service/
|   |   |-- repository/
|   |   |-- model/
|   |   `-- DataInitializer.java
|   `-- src/main/resources/
|       `-- application.properties
|
|-- frontend/             <- Interface React + Vite (porta 5173)
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   `-- styles.css
|   |-- public/
|   `-- vite.config.js
|
`-- docs/
    |-- diagramas/
    `-- historias/
```

Fluxo principal da aplicacao:

```text
Landing publica (#/inicio)
        |
        v
Login / Cadastro (#/auth)
        |
        v
Area interna conforme o perfil
  - Cliente  -> automoveis, pedidos, ofertas de credito, empregadores, perfil
  - Empresa  -> clientes, pedidos, automoveis, perfil
  - Banco    -> pedidos, automoveis, contratos de credito, perfil
```

Fluxo MVC do backend:

```text
Frontend -> Controller -> Service -> Repository -> H2 Database
```

## Backend - Spring Boot (Java 17)

### Estrutura obrigatoria por camadas

- `controller/` -> recebe requisicoes HTTP e responde em JSON.
- `service/` -> concentra regras de negocio, validacoes e fluxo do sistema.
- `repository/` -> acesso a banco via Spring Data JPA.
- `model/` -> entidades e objetos centrais do dominio.

### Entidades principais

- `Usuario` -> classe base com `id`, `login` e `senha`.
- `Cliente` -> extende `Usuario` e armazena `nome`, `cpf`, `rg`, `endereco`, `profissao` e `empregadores`.
- `Agente` -> extende `Usuario` e armazena `cnpj`, `nomeFantasia` e `tipo`.
- `Banco` e `Empresa` -> especializacoes de `Agente`.
- `Empregador` -> empresa vinculada ao cliente, com `nomeEmpresa` e `rendimento`.
- `Automovel` -> frota com `matricula`, `placa`, `marca`, `modelo`, `ano`, disponibilidade e imagem.
- `PedidoAluguel` -> liga cliente e automovel, com datas, status, valor total e vinculos para contratos.
- `ContratoCredito` -> controle de valor, parcelas, banco e status.
- `ContratoAluguel` -> assinatura, data fim, proprietario, tipo de propriedade e status ativo.

### Regras e validacoes ja implementadas

- Login unico global entre clientes e agentes.
- Nome de cliente nao pode conter numeros.
- CPF deve ter 11 numeros.
- RG deve ter 9 numeros.
- CNPJ deve ter 14 numeros.
- Cada cliente pode ter no maximo 3 empregadores cadastrados.
- Rendimento de empregador deve ser positivo.
- Placa, matricula e disponibilidade da frota sao controladas no modulo de automoveis.

### Endpoints REST principais

#### Autenticacao

- `POST /auth/login`
- `POST /auth/cliente/login`
- `POST /auth/agente/login`

#### Clientes

- `POST /clientes`
- `GET /clientes`
- `GET /clientes/{id}`
- `PUT /clientes/{id}`
- `DELETE /clientes/{id}`
- `POST /clientes/{id}/empregadores`
- `DELETE /clientes/{clienteId}/empregadores/{empregadorId}`

#### Agentes

- `POST /agentes`
- `GET /agentes`
- `GET /agentes/{id}`
- `PUT /agentes/{id}`
- `DELETE /agentes/{id}`

#### Automoveis

- `POST /automoveis`
- `GET /automoveis`
- `GET /automoveis/disponiveis`
- `GET /automoveis/{id}`
- `PUT /automoveis/{id}`
- `PUT /automoveis/{id}/disponivel`
- `PUT /automoveis/{id}/indisponivel`
- `DELETE /automoveis/{id}`

#### Pedidos

- `POST /pedidos`
- `GET /pedidos`
- `GET /pedidos/cliente/{clienteId}`
- `GET /pedidos/{id}`
- `PUT /pedidos/{id}`
- `PUT /pedidos/{id}/cancelar`
- `PUT /pedidos/{id}/avaliar`
- `PUT /pedidos/{id}/aprovar`
- `PUT /pedidos/{id}/rejeitar`

#### Contratos

- `GET /contratos/aluguel`
- `POST /contratos/aluguel`
- `PUT /contratos/aluguel/{id}/assinar`
- `PUT /contratos/aluguel/{id}/encerrar`
- `DELETE /contratos/aluguel/{id}`
- `GET /contratos/credito`
- `GET /contratos/credito/cliente/{clienteId}`
- `POST /contratos/credito`
- `PUT /contratos/credito/{id}/aprovar`
- `PUT /contratos/credito/{id}/recusar`
- `PUT /contratos/credito/{id}/cancelar`
- `DELETE /contratos/credito/{id}`

### Banco de dados

- Banco utilizado: H2 em arquivo local.
- URL padrao: `jdbc:h2:file:./sistema-aluguel-carros-db;AUTO_SERVER=TRUE`
- Porta da API: `8080`
- Console H2: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- Estrategia JPA: `spring.jpa.hibernate.ddl-auto=update`

### Dados iniciais

O backend cria dados basicos na primeira execucao em [DataInitializer.java](./backend/src/main/java/br/com/aluguelcarros/DataInitializer.java):

- Cliente inicial
  - login: `carlos.mendes@email.com`
  - senha: `Senha123`
- Agente empresa inicial
  - login: `agente@locadora.com`
  - senha: `Agente123`
- Frota inicial com 8 automoveis

## Frontend - React + Vite

### Stack

- React 18
- JavaScript
- Vite 5
- CSS puro
- Hash routing no `App.jsx`
- `fetch` centralizado em [clientesApi.js](./frontend/src/services/clientesApi.js)

### Paginas e experiencia atual

- `PublicHomePage.jsx` -> landing page publica com hero, busca visual, frota em destaque, ofertas e parceiros.
- `AuthPage.jsx` -> login e cadastro de cliente/agente.
- `ClientesPage.jsx` -> listagem e gerenciamento de clientes.
- `ClienteFormPage.jsx` -> criacao e edicao de clientes.
- `AutomoveisPage.jsx` -> vitrine interna e administracao da frota.
- `PedidosPage.jsx` -> listagem de pedidos conforme o perfil.
- `NovoPedidoPage.jsx` e `EditarPedidoPage.jsx` -> fluxo de solicitacao de aluguel.
- `ContratoCreditoPage.jsx` e `ContratosCredito.jsx` -> gestao de contratos de credito.
- `PerfilClientePage.jsx` e `PerfilAgentePage.jsx` -> manutencao dos dados do usuario autenticado.

### Navegacao

- Rota inicial publica: `#/inicio`
- Autenticacao: `#/auth`
- Rota interna padrao apos login: `#/automoveis`

### Integracao com o backend

O Vite esta configurado para fazer proxy local para a API Spring Boot:

```js
proxy: {
  "/clientes":   "http://localhost:8080",
  "/agentes":    "http://localhost:8080",
  "/auth":       "http://localhost:8080",
  "/automoveis": "http://localhost:8080",
  "/pedidos":    "http://localhost:8080",
  "/contratos":  "http://localhost:8080"
}
```

Isso permite que o frontend chame URLs relativas como `/auth/login` e `/clientes` durante o desenvolvimento.

## Como Rodar o Projeto

### Pre-requisitos

- Java 17+
- Maven 3.9+
- Node.js 18+
- npm

### 1. Backend

```powershell
cd C:\Users\gv\Documents\GitHub\PROJETOSBONS\sistema-aluguel-carros\backend
mvn spring-boot:run
```

Backend disponivel em:

- [http://localhost:8080](http://localhost:8080)
- [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

### 2. Frontend

```powershell
cd C:\Users\gv\Documents\GitHub\PROJETOSBONS\sistema-aluguel-carros\frontend
npm install
npm run dev
```

Frontend disponivel em:

- [http://localhost:5173](http://localhost:5173)

### 3. Fluxo de uso

1. Abra `http://localhost:5173`.
2. Acesse a landing page publica.
3. Entre por `Entrar` ou `Cadastrar`.
4. Faca login com um cliente ou agente.
5. Navegue pelos modulos conforme o perfil.

### 4. Build

Backend:

```powershell
cd C:\Users\gv\Documents\GitHub\PROJETOSBONS\sistema-aluguel-carros\backend
mvn clean package
```

Frontend:

```powershell
cd C:\Users\gv\Documents\GitHub\PROJETOSBONS\sistema-aluguel-carros\frontend
npm run build
```

## Estrutura de Arquivos Relevante

```text
backend/
  controller/AuthController.java
  controller/ClienteController.java
  controller/AgenteController.java
  controller/AutomovelController.java
  controller/PedidoAluguelController.java
  controller/ContratoController.java
  service/ClienteService.java
  service/AgenteService.java
  service/AutomovelService.java
  service/PedidoAluguelService.java
  service/ContratoCreditoService.java
  service/ContratoAluguelService.java
  model/Usuario.java
  model/Cliente.java
  model/Agente.java
  model/Empregador.java
  model/Automovel.java
  model/PedidoAluguel.java
  model/ContratoCredito.java
  model/ContratoAluguel.java
  repository/*.java
  resources/application.properties
  DataInitializer.java

frontend/
  src/App.jsx
  src/styles.css
  src/pages/PublicHomePage.jsx
  src/pages/AuthPage.jsx
  src/pages/ClientesPage.jsx
  src/pages/ClienteFormPage.jsx
  src/pages/AutomoveisPage.jsx
  src/pages/PedidosPage.jsx
  src/pages/NovoPedidoPage.jsx
  src/pages/EditarPedidoPage.jsx
  src/pages/ContratoCreditoPage.jsx
  src/pages/ContratosCredito.jsx
  src/pages/EmpregadoresPage.jsx
  src/pages/OfertasCreditoPage.jsx
  src/pages/PerfilClientePage.jsx
  src/pages/PerfilAgentePage.jsx
  src/components/Layout.jsx
  src/components/DatePicker.jsx
  src/components/LocationPicker.jsx
  src/services/clientesApi.js
  src/utils/cadastroValidacao.js
  vite.config.js
```

## Testes

### Testes automatizados do backend

Arquivos de teste ja presentes no projeto:

- [ClienteControllerIntegrationTest.java](./backend/src/test/java/br/com/aluguelcarros/controller/ClienteControllerIntegrationTest.java)
- [AgenteControllerIntegrationTest.java](./backend/src/test/java/br/com/aluguelcarros/controller/AgenteControllerIntegrationTest.java)

Execucao:

```powershell
cd C:\Users\gv\Documents\GitHub\PROJETOSBONS\sistema-aluguel-carros\backend
mvn test
```

### Validacao do frontend

```powershell
cd C:\Users\gv\Documents\GitHub\PROJETOSBONS\sistema-aluguel-carros\frontend
npm run build
```

### Testes manuais recomendados

- login de cliente
- login de agente
- cadastro de cliente
- cadastro de agente
- CRUD de clientes
- adicao e remocao de empregadores
- CRUD de automoveis
- criacao e alteracao de pedidos
- aprovacao ou rejeicao de pedidos
- criacao e consulta de contratos

## Seguranca e Observacoes Tecnicas

O projeto possui autenticacao funcional, mas sem camada completa de seguranca ainda. O estado atual e:

- `@CrossOrigin` configurado para `http://localhost:5173`.
- Sessao do usuario mantida no frontend por `localStorage`.
- Login realizado por comparacao simples de login e senha no backend.
- As senhas ainda nao usam hash/BCrypt nesta versao atual.
- Nao ha JWT nem Spring Security implementados no momento.

Em outras palavras: a aplicacao esta pronta para demonstracao academica e validacao funcional, mas ainda tem espaco para evolucao em hardening de seguranca.


## Documentacao e Diagramas

- Historias de usuario: [docs/historias/HistoriasDeUsuario.md](./docs/historias/HistoriasDeUsuario.md)
- Diagramas: [docs/diagramas](./docs/diagramas)

Arquivos de diagramas presentes no repositorio:

- `DiagramaDeCasosDeUso..png`
- `DiagramaDeClasses.png`
- `DiagramaDeComponentesALT.png`
- `DiagramaDeImplantacaoALT.png`
- `DiagramaDePacotesALT.png`

## Autores

| Nome | GitHub | LinkedIn | Gmail |
|------|--------|----------|-------|
| Arthur Goncalves | <div align="center"><a href="https://github.com/arthurgvv"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="42" height="42" alt="GitHub Arthur Goncalves"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/arthur-goncalves-62b15232a/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="42" height="42" alt="LinkedIn Arthur Goncalves"></a></div> | <div align="center"><a href="mailto:arthurgvkj@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="42" height="42" alt="Gmail Arthur Goncalves"></a></div> |
| Matheus Guilherme | <div align="center"><a href="https://github.com/theuzao"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="42" height="42" alt="GitHub Matheus Guilherme"></a></div> | <div align="center">-</div> | <div align="center">-</div> |
| Miguel Moreira | <div align="center"><a href="https://github.com/mmoreira41"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="42" height="42" alt="GitHub Miguel Moreira"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/miguel-moreira-69a171269/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="42" height="42" alt="LinkedIn Miguel Moreira"></a></div> | <div align="center"><a href="mailto:miguelmmc08@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="42" height="42" alt="Gmail Miguel Moreira"></a></div> |

## Agradecimentos

- Equipe do projeto, pela divisao das entregas e evolucao continua da aplicacao.
- Disciplina de Engenharia de Software, por orientar a organizacao por camadas, os diagramas e o fluxo de iteracoes.
- Documentacoes oficiais de Spring Boot, React, Vite e H2, que apoiaram a implementacao.
