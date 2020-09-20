import { Node, TypeGuards } from 'ts-morph'

export function findNodesIfIdentifier(node: Node): ReadonlyArray<Node> {
  if (TypeGuards.isIdentifier(node)) {
    return node.getImplementations().map((i) => i.getNode())
  }

  return [node]
}
