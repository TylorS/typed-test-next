import { Node, TypeGuards } from 'ts-morph'

import { getNodeFromVariableDeclaration } from './getNodeFromVariableDeclaration'

export function findNodesIfIdentifier(node: Node): ReadonlyArray<Node> {
  if (TypeGuards.isIdentifier(node)) {
    return node
      .getDefinitionNodes()
      .map((n) => (TypeGuards.isVariableDeclaration(n) ? getNodeFromVariableDeclaration(n) : n))
  }

  return [node]
}
