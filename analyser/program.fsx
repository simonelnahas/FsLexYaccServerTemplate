// This script implements our interactive calculator

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

// The response from the requests made on this website
// will contain system output from e.g. printfn


let strings = [|
        ("2+2","4")
        ("4+4","8")
        |]
        
Array.map 
        (fun (toParse,expectedResult) -> 
            let actualResult = (eval(parse(toParse)))
            printfn "parsing %s gives the result:  %A  expected %A" toParse actualResult expectedResult 
        )
        strings

// Feel free to copy this example and write some more test cases.
// NB: currently newline character \n will not be formatted