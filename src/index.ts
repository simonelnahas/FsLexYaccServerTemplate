import express from "express";
import compression from 'compression';
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import cors from "cors";
import bodyParser from "body-parser";
import fs from 'fs';
import rimraf from 'rimraf';
import { exec, execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 8080; // default port to listen
const IOPath = 'analyser/IO/'
const app = express();

app.set("port", port)
app.use(compression()) // gzip website for speed

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send('This is the homepage of the API use POST on /api');
});

app.get("/api", (req: Request, res: Response): void => {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json({
        response: 'success, you have reached the API, use POST to send the program'
    })
    console.log('/api reached')
});

app.post("/api/programgraph", (req: Request, res: Response): void => {
    res.header('Access-Control-Allow-Origin', '*');
    const body = req.body
    const id = uuidv4();

    if (!fs.existsSync(IOPath + id)) {
        fs.mkdirSync(IOPath + id);
    }

    try {
        console.error("recieved program:\n", body.GCProgram);
        fs.writeFileSync(IOPath + id + "/program.gc", body.GCProgram);

        console.log('Generating Program Graph...')
        // exec("mono analyser/program.exe "+id, (error, stdout, stderr) => { // for compiled version
        exec("fsharpi analyser/program.fsx "+id+" graph", (error, stdout, stderr) => {
            let response: string = ''
            if (error) {
                res.statusCode = 400
                response = `error: ${error.message}`
                console.log(response)
            } else if (stderr) {
                res.statusCode = 401
                response = `stderr: ${stderr}`
                console.log(response)
            } else {
                res.statusCode = 200
                response = stdout
                console.log('response \n\n', response)
            }
            res.send(response)
            rimraf(IOPath+id, () => console.log("deleted "+id))

        });

    } catch (e) {
        res.status(400).send(e)
        rimraf(IOPath+id, () => console.log("deleted "+id))
    }


});

app.post("/api/interpret", (req: Request, res: Response): void => {
    res.header('Access-Control-Allow-Origin', '*');
    const body = req.body
    const id = uuidv4();

    if (!fs.existsSync(IOPath + id)) {
        fs.mkdirSync(IOPath + id);
    }

    try {
        console.error("recieved program:\n", body.GCProgram);
        fs.writeFileSync(IOPath + id + "/program.gc", body.GCProgram);
        fs.writeFileSync(IOPath + id + "/memory.gc", body.Memory);

        console.log('Generating Interpretation...')
        // exec("mono analyser/program.exe "+id, (error, stdout, stderr) => { // for compiled version
        exec("fsharpi analyser/program.fsx "+id+" interpret", (error, stdout, stderr) => {
            let response: string = ''
            if (error) {
                res.statusCode = 400
                response = `error: ${error.message}`
                console.log(response)
            } else if (stderr) {
                res.statusCode = 401
                response = `stderr: ${stderr}`
                console.log(response)
            } else {
                res.statusCode = 200
                response = stdout
                console.log('response \n\n', response)
            }
            res.send(response)
            rimraf(IOPath+id, () => console.log("deleted "+id))

        });

    } catch (e) {
        res.status(400).send(e)
        rimraf(IOPath+id, () => console.log("deleted "+id))
    }
});

app.post("/api/signs", (req: Request, res: Response): void => {
    res.header('Access-Control-Allow-Origin', '*');
    const body = req.body
    console.log('body',req.body)
    const id = uuidv4();

    if (!fs.existsSync(IOPath + id)) {
        fs.mkdirSync(IOPath + id);
    }

    try {
        console.error("recieved program:\n", body.GCProgram);
        fs.writeFileSync(IOPath + id + "/program.gc", body.GCProgram);
        console.error("recieved abstract memory:\n", body.SignsMemory);
        fs.writeFileSync(IOPath + id + "/abstractMemory.gc", body.SignsMemory);

        console.log('Generating Signs Analysis...')
        // exec("mono analyser/program.exe "+id, (error, stdout, stderr) => { // for compiled version
        exec("fsharpi analyser/program.fsx "+id+" signs", (error, stdout, stderr) => {
            let response: string = ''
            if (error) {
                res.statusCode = 400
                response = `error: ${error.message}`
                console.log(response)
            } else if (stderr) {
                res.statusCode = 401
                response = `stderr: ${stderr}`
                console.log(response)
            } else {
                res.statusCode = 200
                response = stdout
                console.log('response \n\n', response)
            }
            res.send(response)
            rimraf(IOPath+id, () => console.log("deleted "+id))

        });

    } catch (e) {
        res.status(400).send(e)
        rimraf(IOPath+id, () => console.log("deleted "+id))
    }
});