<p align="center">
    <img src="./public/img/logo.png">
</p>

<h1 align="center">
    <img src="./presentation.gif">
</h1>
<br>

## Indice

* [Sobre](#-sobre)
* [Tecnologias utilizadas](#-tecnologias-utilizadas)
* [Como baixar o projeto](#-como-baixar-o-projeto)
* [Como executar o projeto](#-como-executar-o-projeto)
<br>

## 🧾 Sobre

Aplicação WEB para apresentação de **receitas** elaboradas por diversos **chefs**.<br>
_(Este é um projeto criado durante o Bootcamp Launchbase da [Rocketseat](https://rocketseat.com.br/))_.
<br>

## 🚀 Tecnologias utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

1. Back-end
    * [NodeJS](https://nodejs.org/en/)
    * [express](https://expressjs.com/)
    * [multer](https://github.com/expressjs/multer)
    * [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
    * [nodemailer](https://nodemailer.com/about/)
    * [method-override](https://github.com/expressjs/method-override)
    * [express-session](https://github.com/expressjs/session)
    * [connect-pg-simple](https://github.com/voxpelli/node-connect-pg-simple)
    * [pg](https://github.com/brianc/node-postgres)
    * [browser-sync](https://www.browsersync.io/) (dependência de desenvolvimento)
    * [nodemon](https://nodemon.io/) (dependência de desenvolvimento)
    * [npm-run-all](https://github.com/mysticatea/npm-run-all) (dependência de desenvolvimento)
2. Front-end
    * HTML
    * CSS
    * Javascript
    * [nunjucks](https://mozilla.github.io/nunjucks/)
<br>

## 🔽 Como baixar o projeto

```bash
$ git clone https://github.com/victorbadaro/foodfy.git
```
<br>

## 💻 Como executar o projeto

Siga os passos abaixo:

1. Entre no diretório do projeto
    ```bash
    $ cd foodfy
    ```

2. Instale as dependencias do projeto
    ```bash
    $ npm install
    ```

3. Abra o arquivo `database.sql` e execute todos os comandos que estão nele dentro do teu banco de dados (Steps: 1, 2, 3 e 4)

4. No terminal execute o seguinte comando para popular o banco de dados:
    ```bash
    $ node seed
    ```

5. Execute um dos seguintes comandos no teu terminal<br><br>
    Para somente executar o projeto
    
    ```bash
    $ npm start

    # O endereço da tua aplicação estará disponível em http://localhost:3333
    ```
    <br>
    
    Para executar o projeto no mode desenvolvedor. Executando assim, o servidor reiniciará automaticamente quando alguma alteração for realizada no código do projeto e também já irá atualizar as páginas da aplicação quando alguma alteração for feita em sua estrutura ou estilização
    ```bash
    $ npm run dev

    # O endereço da tua aplicação estará disponível em http://localhost:3000
    ```
<br>

✅ Pronto! Se você seguiu corretamente os passos acima o projeto já estará sendo executado localmente em tua máquina.
<br>

---
<p align="center">Desenvolvido com ❤ por <a href="https://github.com/victorbadaro">Victor Badaró</a></p>