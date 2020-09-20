import { doEffect, Effect, EffectGenerator, zip } from '@typed/fp/Effect'
import { createUuid, UuidEnv } from '@typed/fp/Uuid'
import { flatten } from 'fp-ts/ReadonlyArray'
import { EOL } from 'os'
import { Node, Type } from 'ts-morph'

import { NodeMetadata, NodeMetadataId, NodePosition, TestConfig, TestModifier } from '../model'
import { isTypedTest } from './isTypedTest'

const NEW_LINE_REGEX = new RegExp(EOL, 'g')

export function findNodeMetadata(node: Node): Effect<UuidEnv, NodeMetadata> {
  return doEffect(function* () {
    const id = yield* createUuid
    const text = node.getText()
    const nodePosition = getNodePosition(node, text)
    const type = node.getType().getText().includes('TestSuite') ? 'test-suite' : 'test-case'
    const config = getConfigFromNode(node)
    const metadata: NodeMetadata = {
      ...nodePosition,
      id: NodeMetadataId.wrap(id),
      type,
      config,
      text,
      children: [],
    }

    return yield* findChildTests(node, metadata)
  })
}

function* findChildTests(
  node: Node,
  nodeMetadata: NodeMetadata,
): EffectGenerator<UuidEnv, NodeMetadata> {
  if (nodeMetadata.type === 'test-suite') {
    return { ...nodeMetadata, children: flatten(yield* zip(node.getChildren().map(visitNode))) }
  }

  return nodeMetadata

  function* visitNode(node: Node): EffectGenerator<UuidEnv, ReadonlyArray<NodeMetadata>> {
    if (isTypedTest(node)) {
      const metadata = yield* findNodeMetadata(node)

      return [yield* findChildTests(node, metadata)]
    } else {
      return flatten(yield* zip(node.getChildren().map(visitNode)))
    }
  }
}

function getNodePosition(node: Node, text: string): NodePosition {
  const sourceFile = node.getSourceFile()
  const [start, end] = getPosition(node)
  const startLine = sourceFile.getText().slice(0, start).split(NEW_LINE_REGEX).length
  const numberOfLines = text.split(NEW_LINE_REGEX).length
  const endLine = startLine + numberOfLines - 1

  return {
    position: [start, end],
    startLine,
    endLine,
    numberOfLines,
  }
}

function getPosition(node: Node): readonly [number, number] {
  const start = node.getStart()
  const width = node.getWidth()

  return [start, start + width]
}

function getConfigFromNode(node: Node) {
  const type = node.getType()
  const [labelType, modifierType, timeoutType] = type.getTypeArguments()

  const config: TestConfig = {
    label: parseTypeToString(labelType),
    modifier: parseTypeToString(modifierType) as TestModifier,
  }

  const timeout = parseFloat(parseTypeToString(timeoutType))

  if (Number.isNaN(timeout)) {
    return config
  }

  return {
    ...config,
    timeout,
  }
}

function parseTypeToString(type: Type): string {
  return stripStrings(type.getText())
}

function stripStrings(str: string): string {
  return str.replace(/^["|']/, '').replace(/["|']$/, '')
}
