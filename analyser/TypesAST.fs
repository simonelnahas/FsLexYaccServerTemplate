// The following code is an example of the types declaration for an interactive calculator.
// It has been based on code by Alberto Lluch Laufente et. al. released on https://gitlab.gbar.dtu.dk/02141/mandatory-assignment

// This file implements a module where we define a data type "expr"
// to store represent arithmetic expressions
module TypesAST

type expr =
  | Num of float
  | TimesExpr of (expr * expr)
  | DivExpr of (expr * expr)
  | PlusExpr of (expr * expr)
  | MinusExpr of (expr * expr)
  | PowExpr of (expr * expr)
  | UPlusExpr of (expr)
  | UMinusExpr of (expr)
