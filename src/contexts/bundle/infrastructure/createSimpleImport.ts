import { createSpecifier } from './createSpecifier'

export function createSimpleImport(importName: string, moduleSpecifier: string) {
  return `import {${importName}} from '${createSpecifier(moduleSpecifier)}'`
}
