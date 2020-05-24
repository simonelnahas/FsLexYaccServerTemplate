// The following code is an example of an interactive calculator.
// It has been based on code by Alberto Lluch Laufente et. al. released on https://gitlab.gbar.dtu.dk/02141/mandatory-assignment

// We need to import a couple of modules, including the generated lexer and parser
#r "FsLexYacc.Runtime.10.0.0/lib/net46/FsLexYacc.Runtime.dll"
open FSharp.Text.Lexing
open System
open System.IO
#load "TypesAST.fs"
open TypesAST
#load "Parser.fs"
open Parser
#load "Lexer.fs"
open Lexer

// We define the evaluation function recursively, by induction on the structure
// of arithmetic expressions (AST of type expr)
let rec eval e =
  match e with
    | Num(x) -> x
    | TimesExpr(x,y) -> eval(x) * eval (y)
    | DivExpr(x,y) -> eval(x) / eval (y)
    | PlusExpr(x,y) -> eval(x) + eval (y)
    | MinusExpr(x,y) -> eval(x) - eval (y)
    | PowExpr(x,y) -> eval(x) ** eval (y)
    | UPlusExpr(x) -> eval(x)
    | UMinusExpr(x) -> - eval(x)

// We parse the input
let parse input =
    // translate string into a buffer of characters
    let lexbuf = LexBuffer<char>.FromString input
    // translate the buffer into a stream of tokens and parse them
    let res = Parser.start Lexer.tokenize lexbuf
    // return the result of parsing (i.e. value of type "expr")
    res

/// Main input
let parseProgram inputString requestType = 
  match requestType with 
  | "calculate" ->  
    printfn "Result: %A" (eval(parse(inputString)))
  | _ -> printfn "ERROR: requestType is invalid"  

// for F# compiled version
// [<EntryPoint>]
// let main (args:string array) : int =
//   let id = args.[0]
//   parseProgram id
//   0


// for F# interactive - `fsharpi`
// When Node.js invokes this FMT it will take the path and read the code in that path
try
    let id = (fsi.CommandLineArgs.[1])
    let requestType = (fsi.CommandLineArgs.[2]) 
    let path = "analyser/IO/"+id+"/program"
    let inputString = File.ReadAllText(path)
    parseProgram inputString requestType
with _ ->
    printfn "Error"
