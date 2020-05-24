///
/// STEP Server Template using FsLexYacc parser generator
///

// The following is an implementation of the STEP Server Node.js application.
// Please use the `EDIT HERE` indicators to modify the code such that it works for your FMT.

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

const port = process.env.PORT || 8080; // Default port to listen
const IOPath = 'analyser/IO/'
const app = express();

app.set("port", port)
app.use(compression()) // gzip website for speed

// sSart the Express server
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
    // Get the request body
    const body = req.body

    // Create temporary folder named after a newly generated UUID
    const id = uuidv4();
    if (!fs.existsSync(IOPath + id)) {
        fs.mkdirSync(IOPath + id);
    }

    try {

        // EDIT HERE:
        // Such that the Name matches the InputEditor SMD Component that holds the code
        // The following lines does:
        // Save code from the InputEditor SMD component with Name='Program'
        console.log("recieved program:\n", body.Program);
        fs.writeFileSync(IOPath + id + "/program", body.Program);

        console.log('Calculating...')

        // use this line to execute a compiled version of F# code
        // exec("mono analyser/program.exe "+id+" interpret", (error, stdout, stderr) => {

        // EDIT HERE:
        // Change `analyser/program.fsx` to the path of your FMT
        // Optionally use a command line argument such as `calculate` in case the FMT can handle several kinds of FMT analysis
        // The following lines does:
        // Execute FMT with F# interactive mode.
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
            // Send back response from FMT to the STEP website client
            res.send(response)

            // Delete temporary folder
            rimraf(IOPath+id, () => console.log("deleted "+id))
        });

    } catch (e) {
        res.status(400).send(e)
        rimraf(IOPath+id, () => console.log("deleted "+id))
    }
});