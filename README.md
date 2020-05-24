# FsYaccLex Server Template

Use this template to create a server that will serve requests with FSharp code

## Build the program

write your lexer specification in [Lexer.fsl](analyser/Lexer.fsl)
then run: `yarn fsharp:buildLexer`

write your parser specification in [Parser.fsp](analyser/Parser.fsp)
then run: `yarn fsharp:buildParser`

use the parser in [program.fsx](analyser/program.fsx)
then run: `yarn fsharp:run`

To execute all of the above commands run: `yarn fsharp:dev`


## expose your program with a server

Modify the code as specified in the comments inside the file: [index.ts](src/index.ts)
