import { Node, VariableDeclaration } from 'ts-morph'

export function getNodeFromVariableDeclaration(declaration: VariableDeclaration): Node {
  // 0: Identifier, 1: =, 2: Node we want
  return declaration.getChildAtIndex(2)
}
