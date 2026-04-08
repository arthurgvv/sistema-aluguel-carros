# sistema-aluguel-carros

Sistema web em Java com Spring Boot e frontend React para a entrega do CRUD completo de cliente.

## Estrutura do backend

O backend foi organizado no padrao MVC pedido:

- `controller/`
- `service/`
- `repository/`
- `model/`

## Funcionalidades

- login + cadastro na mesma tela
- listagem de clientes em pagina separada
- criacao de cliente em pagina separada
- edicao de cliente em pagina separada
- exclusao de cliente
- persistencia em H2

## Endpoints

### Autenticacao

- `POST /auth/login`

### CRUD de cliente

- `POST /clientes`
- `GET /clientes`
- `GET /clientes/{id}`
- `PUT /clientes/{id}`
- `DELETE /clientes/{id}`

## Banco de dados

O projeto usa H2 persistido em arquivo local:

- arquivo base: `sistema-aluguel-carros-db`
- console H2: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

## Como executar

### Backend Spring Boot

```powershell
cd \sistema-aluguel-carros
mvn spring-boot:run
```

### Frontend React

```powershell
cd sistema-aluguel-carros\frontend
npm install
npm run dev
```

Frontend em:

- [http://localhost:5173](http://localhost:5173)

Backend em:

- [http://localhost:8080](http://localhost:8080)

## Fluxo esperado

1. abrir a tela de login/cadastro
2. cadastrar um cliente
3. fazer login com o mesmo cliente
4. abrir a listagem
5. criar, editar e deletar clientes

## Testes no Postman

### Criar cliente

`POST http://localhost:8080/clientes`

### Login

`POST http://localhost:8080/auth/login`

### Listar clientes

`GET http://localhost:8080/clientes`

### Buscar cliente por id

`GET http://localhost:8080/clientes/1`

### Atualizar cliente

`PUT http://localhost:8080/clientes/1`


### Deletar cliente

`DELETE http://localhost:8080/clientes/1`

## Teste automatizado

Existe um teste de integracao do CRUD em:

- `src/test/java/br/com/aluguelcarros/controller/ClienteControllerIntegrationTest.java`

Para rodar:

```powershell
cd \sistema-aluguel-carros
mvn test
```
