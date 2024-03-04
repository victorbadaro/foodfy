# foodfy

<p align="center" style="padding: 8px 0 0; background: #30363D">
    <img src="./public/img/logo.png">
</p>

<h1 align="center">
    <img src="./presentation.gif">
</h1>
<br>

[![LEIAME.md](https://img.shields.io/badge/-Leia%20em%20Portugu%C3%AAs-brightgreen?style=for-the-badge)](./LEIAME.md)

## Summary

* [About](#-about)
* [Technologies](#-technologies)
* [How to download the project](#-how-to-download-the-project)
* [How to run the project](#-how-to-run-the-project)
<br>

## 🧾 About

WEB application to show **recipes** made by several **chefs**.<br>
_(This is a project created during the Launchbase Bootcamp of the [Rocketseat](https://rocketseat.com.br/))_.
<br>

## 🚀 Technologies

This project was developed using the following technologies:

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
    * [dotenv](https://www.npmjs.com/package/dotenv)
    * [browser-sync](https://www.browsersync.io/) (dev dependency)
    * [nodemon](https://nodemon.io/) (dev dependency)
    * [npm-run-all](https://github.com/mysticatea/npm-run-all) (dev dependency)
2. Front-end
    * HTML
    * CSS
    * Javascript
    * [nunjucks](https://mozilla.github.io/nunjucks/)
<br>

## 🔽 How to download the project

```bash
$ git clone https://github.com/victorbadaro/foodfy.git
```
<br>

## 💻 How to run the project

Follow the steps below:

1. Enter the project directory
    ```bash
    $ cd foodfy
    ```

2. Install all the project dependencies
    ```bash
    $ npm install
    ```

3. Open the `database.sql` file and run all the commands that are in it within your database (Steps: 1, 2, 3 and 4)

    >_You must have the [PostgreSQL](https://www.postgresql.org/download/) database installed on your machine_

4. Fill in the environment variables contained in the .env file found at the project root
    To have a **Mailtrap** username and password (**Mailtrap** is an application used to test the sending of emails from Foodfy app) you need to create an account at [https://mailtrap.io/](https://mailtrap.io/) and within one of your **inboxes** select the **Nodemailer** integration as in the image below:
    <img src="./mailtrap_integration.png">

    ```bash
    # SERVER (optional)
    PORT=

    # DATABASE
    DB_USER=
    DB_PASSWORD=
    DB_HOST=
    DB_PORT=
    DB_DATABASE=foodfy

    # MAILTRAP
    MAILTRAP_USER=
    MAILTRAP_PASSWORD=
    ```

5. In your terminal run the following command to populate the database:

    ```bash
    $ node seed
    ```
    
    If everything runs correctly, the following message will be displayed on your terminal:
    ```bash
    Database is ready to be used now
    Run one of the following commands on your terminal (without quotes):
    "npm run dev" (if you want to run the app on developer mode)
    "npm start" (if you want to run the app on production mode)
    ```
    ---
    **Warning**: specifically to run the `seed.js` file you must, before you running it, put the database connection data directly in the `src/config/db.js` file, since the environment variables (.env) only will work running the server. After running `seed.js` file you can return the original code in the `src/config/db.js` file:

    ```javascript
    const { Pool } = require('pg');

    module.exports = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE
    });
    ```

6. Run one of the following commands on your terminal<br><br>
    To run the project only
    
    ```bash
    $ npm start

    # Your application will be available in http://localhost:3333
    ```
    <br>
    
    To run the project on developer mode. Running the project this way, the server will automatically restart when any changes are made in the project code and will also update the application pages when any changes are made in its structure or styling
    ```bash
    $ npm run dev

    # Your application will be available in http://localhost:3000
    ```
<br>

✅ Nice! If you followed all the steps above correctly the project will be running locally on you machine already.
<br>

---
<p align="center">Developed with ❤ by <a href="https://github.com/victorbadaro">Victor Badaró</a></p>