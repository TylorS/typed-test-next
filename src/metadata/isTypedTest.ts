import { Node, Type, TypeGuards } from 'ts-morph'

export function isTypedTest<A extends Node>(node: A): boolean {
  const type = TypeGuards.isCallExpression(node) ? node.getReturnType() : node.getType()
  const unionTypes = type.getUnionTypes()

  if (unionTypes.length > 0) {
    return unionTypes.every((type) => isTest(type, node))
  }

  return isTest(type, node)
}

function isTest(type: Type, node: Node): boolean {
  return isTestSuite(type, node) || isTestCase(type, node)
}

function isTestSuite(type: Type, node: Node): boolean {
  return hasValidType(type, node) && hasValidTestConfig(type, node) && hasValidTests(type, node)
}

function isTestCase(type: Type, node: Node): boolean {
  return (
    hasValidType(type, node) && hasValidTestConfig(type, node) && hasValidRunTestCase(type, node)
  )
}

// TODO: is there a better way to do this?
function hasValidTests(type: Type, node: Node): boolean {
  const property = type.getProperty('tests')
  const tests = property?.getTypeAtLocation(node)
  const text = tests?.getText() ?? ''

  return text.includes('Test<string') && text.includes('TestModifier') && text.includes('number>[]')
}

function hasValidType(type: Type, node: Node): boolean {
  return isStringOrLiteral(type.getProperty('type')?.getTypeAtLocation(node))
}

function hasValidTestConfig(type: Type, node: Node): boolean {
  const config = type.getProperty('config')?.getTypeAtLocation(node)

  if (!config) {
    return false
  }

  const label = config.getProperty('label')?.getTypeAtLocation(node)
  const modifier = config.getProperty('modifier')?.getTypeAtLocation(node)
  const timeout = config.getProperty('timeout')?.getTypeAtLocation(node)

  return isStringOrLiteral(label) && isStringOrLiteral(modifier) && isNumber(timeout)
}

// TODO: is there a better way to do this?
function hasValidRunTestCase(type: Type, node: Node): boolean {
  const text = type.getProperty('runTestCase')?.getTypeAtLocation(node).getText()

  return text
    ? text.includes('Effect') && text.includes('TestEnv') && text.includes('TestResult')
    : false
}

function isStringOrLiteral(type?: Type): boolean {
  return type ? type.isString() || type.isStringLiteral() : false
}

function isNumber(type?: Type): boolean {
  return type ? type.isNumber() || type.isNumberLiteral() : false
}
