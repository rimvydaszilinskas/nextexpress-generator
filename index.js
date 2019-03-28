#!/usr/bin/env node

const fs = require('fs');
const inquirer = require('inquirer');
const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');
const CLI = require('clui');
const Spinner = CLI.Spinner;

// clear the console before continuing and print out the logo
clear();
console.log(
    chalk.yellow(
        figlet.textSync("NextExpress", {horizontalLayout: true})
    )
);

var questions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'Enter project name:'
    },
    {
        type: 'input',
        name: 'author',
        message: 'Enter author name:'
    },
    {
        type: 'input',
        name: 'description',
        message: 'Description:'
    },
];

// only continue when the questions have been answered
inquirer.prompt(questions).then(answers => {
    if(answers.projectName === '') {
        console.log(chalk.red('Project name cannot be blank!'));
        console.log(chalk.red('Exiting now...'))
        process.exit();
    }
    console.log(chalk.green(`Creating project ${answers.projectName}`));

    // start up a spinner
    var countdown = new Spinner('Initializing');
    countdown.start();

    var projectName = answers.projectName;

    // package.json is dynamic because of naming
    // everything else is copied from ./samples
    var packageJSON = '{\n' +
    `\t"name": "${projectName}",\n` +
    `\t"version": "1.0.0",\n` +
    `\t"description": "${answers.description}",\n` +
    `\t"main": "index.js",\n` +
    `\t"scripts": {\n` +
    `\t\t"dev": "node server.js",\n` +
    `\t\t"build": "next build",\n` +
    `\t\t"start": "NODE_ENV=production node server.js"\n` +
    `\t},\n` +
    `\t"keywords": [],\n` +
    `\t"author":"${answers.author}",\n` +
    `\t"license":"ISC",\n` +
    `\t"dependencies":{\n` +
    `\t\t"@zeit/next-css":"^1.0.1",\n` +
    `\t\t"express":"^4.16.4",\n` +
    `\t\t"next":"^8.0.3",\n` +
    `\t\t"react":"^16.8.5",\n` +
    `\t\t"react-dom":"^16.8.5"\n` +
    `\t}\n` +
    '}';

    const nextConfig = `const withCss = require('@zeit/next-css');
module.exports = withCss();`;

    const indexFile = `import Head from 'next/head';
import React from 'react';

class Index extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>${projectName}</title>
                </Head>
                <div>
                    <h1>${projectName}</h1>
                        <p>Hello world from ReactJS</p>
                </div>
            </React.Fragment>
        )
    }
}
        
export default Index;`;

    const serverFile = `const next = require('next');
const express = require('express');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();
    
app.prepare().then(() => {
    const server = express();

    server.get("/", (req, res) => {
        res.send("Hello world from NODE.JS");
    });
        
    server.get("*", (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if(err)
            throw err;
            console.log(\`Ready on http://localhost:3000\`)
    });
});
`;

    countdown.message(`Creating the ${projectName} folder.`)

    fs.mkdir(`./${projectName}`, (err) => {
        if(err) {
            countdown.stop();
            console.log(chalk.red('Error creating the project folder! Now exiting...'));
            process.exit(0);
        }
        console.log(chalk.green(' - Project folder created!'));

        countdown.message('Generating package.json');
        fs.writeFile(`./${projectName}/package.json`, packageJSON, (err) => {
            if(err){
                countdown.stop();
                console.log(chalk.red('Error generating package.json file! Now exiting...'));
                process.exit(0);
            }
            console.log(chalk.green(' - package.json generated'));

            countdown.message('Generating server.js');
            fs.writeFile(`./${projectName}/server.js`, serverFile, (err) => {
                if(err){
                    countdown.stop();
                    console.log(chalk.red('Error generating server.js file! Now exiting...'));
                    process.exit(0);
                }
                console.log(chalk.green(' - server.js generated'));      
                
                countdown.message('Configuring next.js');
                fs.writeFile(`./${projectName}/next.config.js`, nextConfig, (err) => {
                    if(err){
                        countdown.stop();
                        console.log(chalk.red('Error configuring next.js! Now exiting...'));
                        process.exit(0);
                    }
                    fs.mkdir(`./${projectName}/pages`, (err) => {
                        if(err){
                            countdown.stop();
                            console.log(chalk.red('Error configuring next.js! Now exiting...'));
                            process.exit(0);
                        }
                        fs.writeFile(`./${projectName}/pages/index.js`, indexFile,(err) => {
                            if(err){
                                countdown.stop();
                                console.log(chalk.red('Error configuring next.js! Now exiting...'));
                                process.exit(0);
                            }
                            countdown.stop();

                            // display the general instructions for further project use
                            console.log(chalk.green(`Created ${projectName} project!`));
                            console.log('\n');
                            console.log(chalk.yellow('----- QUICK START -----'));
                            console.log(`1. cd ${projectName}`);
                            console.log(`2. npm install`);
                            console.log(`3. npm run dev`);
                            console.log(`Then open http://localhost:3000 in your browser.`);
                            console.log('\n');
                            console.log(chalk.green('Created by http://github.com/rimvydaszilinskas'));
                        });
                    });
                    
                });
            });
        });    
    });

});