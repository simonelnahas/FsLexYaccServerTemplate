"use strict";
///
/// STEP Server Template using FsLexYacc parser generator
///
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// The following is an implementation of the STEP Server Node.js application.
// Please use the `EDIT HERE` indicators to modify the code such that it works for your FMT.
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const rimraf_1 = __importDefault(require("rimraf"));
const child_process_1 = require("child_process");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 8080; // Default port to listen
const IOPath = 'analyser/IO/';
const app = express_1.default();
app.set("port", port);
app.use(compression_1.default()); // gzip website for speed
// sSart the Express server
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
app.post("/api/calculate", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    // Get the request body
    const body = req.body;
    console.log(body);
    // Create temporary folder named after a newly generated UUID
    const id = uuid_1.v4();
    if (!fs_1.default.existsSync(IOPath + id)) {
        fs_1.default.mkdirSync(IOPath + id);
    }
    try {
        // EDIT HERE:
        // Such that the Name matches the InputEditor SMD Component that holds the code
        // The following lines does:
        // Save code from the InputEditor SMD component with Name='Program'
        console.log("recieved program:\n", body.Program);
        fs_1.default.writeFileSync(IOPath + id + "/program", body.Program);
        console.log('Calculating...');
        // use this line to execute a compiled version of F# code
        // exec("mono analyser/program.exe "+id+" interpret", (error, stdout, stderr) => {
        // EDIT HERE:
        // Change `analyser/program.fsx` to the path of your FMT
        // Optionally use a command line argument such as `calculate` in case the FMT can handle several kinds of FMT analysis
        // The following lines does:
        // Execute FMT with F# interactive mode.
        // And provide the path to the temporary folder with the saved code
        child_process_1.exec("fsharpi analyser/program.fsx " + id + " calculate", (error, stdout, stderr) => {
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
            // Send back response from FMT to the STEP website client
            res.send(response);
            // Delete temporary folder
            rimraf_1.default(IOPath + id, () => console.log("deleted " + id));
        });
    }
    catch (e) {
        res.status(400).send(e);
        rimraf_1.default(IOPath + id, () => console.log("deleted " + id));
    }
});
//# sourceMappingURL=index.js.map