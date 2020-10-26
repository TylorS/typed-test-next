import { describe, given, it } from '@build/shared/domain'
import assert from 'assert'
import { join } from 'path'
import { ModuleResolutionKind, ScriptTarget } from 'typescript'

import { findTsConfig } from './findTsConfig'

const testFixtures = join(__dirname, '__test_fixtures__')

export const test = describe(`findTsConfig`, [
  given(`a tsconfig that extends another`, [
    it(`returns the configs merged together`, () => {
      const { compilerOptions, files } = findTsConfig({ directory: testFixtures })

      assert.deepStrictEqual(true, compilerOptions.declaration)
      assert.deepStrictEqual(true, compilerOptions.downlevelIteration)
      assert.deepStrictEqual(true, compilerOptions.importHelpers)
      assert.deepStrictEqual(ModuleResolutionKind.NodeJs, compilerOptions.moduleResolution)
      assert.deepStrictEqual(true, compilerOptions.noImplicitAny)
      assert.deepStrictEqual(true, compilerOptions.noUnusedLocals)
      assert.deepStrictEqual(true, compilerOptions.noUnusedParameters)
      assert.deepStrictEqual(true, compilerOptions.noFallthroughCasesInSwitch)
      assert.deepStrictEqual(true, compilerOptions.strict)
      assert.deepStrictEqual(true, compilerOptions.strictFunctionTypes)
      assert.deepStrictEqual(true, compilerOptions.strictNullChecks)
      assert.deepStrictEqual(true, compilerOptions.strictPropertyInitialization)
      assert.deepStrictEqual(true, compilerOptions.sourceMap)
      assert.deepStrictEqual(join(testFixtures, './lib'), compilerOptions.outDir)
      assert.deepStrictEqual(ScriptTarget.ES5, compilerOptions.target)

      assert.deepStrictEqual(['source/index.ts'], files)
    }),
  ]),
])
