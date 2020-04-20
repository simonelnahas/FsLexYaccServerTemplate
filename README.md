# FsYaccLex Server Template

Use this template to create a server that will serve requests with FSharp code

## Pre Release
This is a workspace template under development. 
Pull requests are very welcome!

## Build the program

write your lexer specification in [Lexer.fsl](analyser/Lexer.fsl)
then run: `yarn fsharp:buildLexer`

write your parser specification in [Parser.fsp](analyser/Parser.fsp)
then run: `yarn fsharp:buildParser`

use the parser in [program.fsx](analyser/program.fsx)
then run: `yarn fsharp:run`

To execute all of the above commands run: `yarn fsharp:dev`


## expose your program with a server

WIP
can't wait? look at [index.ts](src/index.ts)