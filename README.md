# FsYaccLex STEP Server Template

Use this template to create a STEP server to host your formal methods tool (FMT)

## Develop the Formal Methods Tool

write your lexer specification in [Lexer.fsl](analyser/Lexer.fsl)
then run: `yarn fsharp:buildLexer`

write your parser specification in [Parser.fsp](analyser/Parser.fsp)
then run: `yarn fsharp:buildParser`

use the parser in [program.fsx](analyser/program.fsx)
then run: `yarn fsharp:run`

To execute all of the above commands run: `yarn fsharp:dev`


## Run the Server

To make the sever receive requests on an API route that will execute your FMT, 
please modify the code as specified in the comments inside the file: [index.ts](src/index.ts). 
To run the server then run: `yarn dev:start`. 
This will build and run the server.