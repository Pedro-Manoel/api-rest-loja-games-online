<h1 align="center">
    <p> 🕹️ API REST Loja de Games Online </p>
</h1>

<p align="center">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/Pedro-Manoel/api-rest-loja-games-online?style=flat-square">
    <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/Pedro-Manoel/api-rest-loja-games-online?style=flat-square">
    <img alt="Repository size" src="https://img.shields.io/github/repo-size/Pedro-Manoel/api-rest-loja-games-online?style=flat-square">
    <img alt="GitHub license" src="https://img.shields.io/github/license/Pedro-Manoel/api-rest-loja-games-online?style=flat-square"><br/>
</p>

## 🔖 Sobre

Projeto de uma API REST simples de uma loja de games online desenvolvido com [Node.js](https://nodejs.org/en/) para fins de aprendizagem dos conceitos de [SOLID](https://medium.com/desenvolvendo-com-paixao/o-que-%C3%A9-solid-o-guia-completo-para-voc%C3%AA-entender-os-5-princ%C3%ADpios-da-poo-2b937b3fc530), [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) e [TDD](https://www.devmedia.com.br/test-driven-development-tdd-simples-e-pratico/18533)

## 💥 Utilização

- ### 👉 **Pré-requisitos**

  - É **necessário** possuir o **[Node.js](https://nodejs.org/en/)** instalado no computador
  - É **necessário** possuir um gerenciador de pacotes, como o **[Yarn](https://yarnpkg.com/)**, instalado no computador
  - É **necessário** possuir o **[Docker](https://www.docker.com/)** instalado no computador

1. Faça o clone do repositório:

   ```sh
     $ git clone https://github.com/Pedro-Manoel/api-rest-loja-games-online.git
   ```

2. Entre na pasta do projeto:

   ```sh
     $ cd api-rest-loja-games-online
   ```

3. Configure a aplicação criando um arquivo `.env`, atribuindo o devido valor as seguintes variáveis:

   ```
      # Prisma
      DATABASE_URL="postgresql://docker:docker@localhost:5432/app_loja_games?schema=public"
      DATABASE_URL_TEST="postgresql://docker:docker@localhost:5432/app_loja_games_test?schema="

      # App
      NODE_ENV=
      PORT=
      TOKEN_KEY=

      # Database
      DATABASE_HOST=localhost
      DATABASE_PORT=5432
      DATABASE_USER=docker
      DATABASE_PASS=docker
      DATABASE_NAME=app_loja_games
   ```

4. Execute o seguinte comando para fazer o download das dependências da aplicação:

   ```sh
   $ yarn
   ```

5. Execute o seguinte comando para criar e executar o container no docker:

   ```sh
   $ docker compose up -d
   ```

6. Execute o seguinte comando para criar as tabelas no banco de dados

   ```sh
   $ yarn prisma migrate dev
   ```

7. Execute o seguinte comando para executar a aplicação:

   ```sh
   $ yarn dev
   ```

8. Execute o seguinte comando para executar os testes da aplicação:

   ```sh
   $ yarn test
   ```

## 🚀 Tecnologias

- Acesso e controle do banco de dados com [prisma](https://www.prisma.io/)
- Testes de unidade com [jest](https://jestjs.io/pt-BR/)
- Testes de integração com [supertest](https://www.npmjs.com/package/supertest)
- Injeção de dependencia com [tsyringe](https://www.npmjs.com/package/tsyringe)
- Upload de arquivos com [multer](https://www.npmjs.com/package/multer)
- Autenticação de usuários com [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- Verificação de lint com [eslint](https://eslint.org/)
- Correção de código com [prettier](https://prettier.io/)

## ✅ Testes

![Tests](.github/images/tests.jpg)

## 🔰 Rotas

### 🚏 `/users`

- **`/`** **POST** : criar um usuário.
- **`/`** **PUT** : atualizar um usuário.
- **`/`** **DELETE** : remover um usuário.
- **`/sessions`** **POST** : cria uma sessão para um usuário.

### 🚏 `/games`

- **`/`** **POST** : criar um game.
- **`/{id}`** **PUT** : atualizar um game.
- **`/{id}`** **DELETE** : remover um game.
- **`/{id}/image`** **PATCH** : atualizar a imagem de um game.

### 🚏 `/purchases`

- **`/`** **POST** : criar uma compra de um game.

## 📃 Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
