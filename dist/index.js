"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 8080; // default port to listen
const IOPath = 'analyser/IO/';
const app = express_1.default();
app.set("port", port);
app.use(compression_1.default()); // gzip website for speed
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send('This is the homepage of the API use POST on /api');
});
app.get("/api", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json({
        response: 'success, you have reached the API, use POST to send the program'
    });
    console.log('/api reached');
});
app.post("/api/programgraph", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const body = req.body;
    const id = uuid_1.v4();
    if (!fs_1.default.existsSync(IOPath + id)) {
        fs_1.default.mkdirSync(IOPath + id);
    }
    try {
        console.error("recieved lexer:\n", body.GCProgram);
        fs_1.default.writeFileSync(IOPath + id + "/program.gc", body.GCProgram);
        console.log('Generating Program Graph...');
        // exec("mono analyser/program.exe "+id, (error, stdout, stderr) => { // for compiled version
        child_process_1.exec("fsharpi analyser/program.fsx " + id + " graph", (error, stdout, stderr) => {
            let response = '';
            if (error) {
                res.statusCode = 400;
                response = `error: ${error.message}`;
                console.log(response);
            }
            else if (stderr) {
                res.statusCode = 401;
                response = `stderr: ${stderr}`;
                console.log(response);
            }
            else {
                res.statusCode = 200;
                response = stdout;
                console.log('response \n\n', response);
            }
            res.send(response);
        });
    }
    catch (e) {
        res.status(400).send(e);
    }
});
app.post("/api/interpret", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const body = req.body;
    const id = uuid_1.v4();
    if (!fs_1.default.existsSync(IOPath + id)) {
        fs_1.default.mkdirSync(IOPath + id);
    }
    try {
        console.error("recieved lexer:\n", body.GCProgram);
        fs_1.default.writeFileSync(IOPath + id + "/program.gc", body.GCProgram);
        fs_1.default.writeFileSync(IOPath + id + "/memory.gc", body.Memory);
        console.log('Generating Program Graph...');
        // exec("mono analyser/program.exe "+id, (error, stdout, stderr) => { // for compiled version
        child_process_1.exec("fsharpi analyser/program.fsx " + id + " interpret", (error, stdout, stderr) => {
            let response = '';
            if (error) {
                res.statusCode = 400;
                response = `error: ${error.message}`;
                console.log(response);
            }
            else if (stderr) {
                res.statusCode = 401;
                response = `stderr: ${stderr}`;
                console.log(response);
            }
            else {
                res.statusCode = 200;
                response = stdout;
                console.log('response \n\n', response);
            }
            res.send(response);
        });
    }
    catch (e) {
        res.status(400).send(e);
    }
});
//# sourceMappingURL=index.js.map