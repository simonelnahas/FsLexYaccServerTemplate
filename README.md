# FsYaccLex STEP Server Template

Use this template to create a STEP server to host your formal methods tool (FMT)

## Develop the Formal Methods Tool

Write your lexer specification in [Lexer.fsl](analyser/Lexer.fsl).
Then run: `yarn fsharp:buildLexer`

Write your parser specification in [Parser.fsp](analyser/Parser.fsp).
Then run: `yarn fsharp:buildParser`

Use the parser in [program.fsx](analyser/program.fsx).
Then run: `yarn fsharp:run`

To execute all of the above commands run: `yarn fsharp:dev`


## Run the Server

To make the sever receive requests on an API route that will execute your FMT, 
please modify the code inside the file [index.ts](src/index.ts) as specified in the comments.

To run the server then run: `yarn dev:start`. 
This will build and run the server.