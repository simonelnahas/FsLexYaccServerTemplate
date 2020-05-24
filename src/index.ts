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

app.post("/api/calculate", (req: Request, res: Response): void => {
    res.header('Access-Control-Allow-Origin', '*');
    // get the request body
    const body = req.body

    // Create temporary folder named after a newly generated UUID
    const id = uuidv4();
    if (!fs.existsSync(IOPath + id)) {
        fs.mkdirSync(IOPath + id);
    }

    try {

        // Saves code from the InputEditor SMD component with Name='GCProgram'
        console.log("recieved program:\n", body.Program);
        fs.writeFileSync(IOPath + id + "/program.gc", body.Program);

        console.log('Calculating...')

        // use this line to execute a compiled version of F# code
        // exec("mono analyser/program.exe "+id+" interpret", (error, stdout, stderr) => {

        // execute FMT with F# interactive mode.
        // And provide the path to the temporary folder with the saved code
        exec("fsharpi analyser/program.fsx "+id+" calculate", (error, stdout, stderr) => {
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
            // send back response from FMT to the STEP website client
            res.send(response)

            // delete temporary folder
            rimraf(IOPath+id, () => console.log("deleted "+id))
        });

    } catch (e) {
        res.status(400).send(e)
        rimraf(IOPath+id, () => console.log("deleted "+id))
    }
});