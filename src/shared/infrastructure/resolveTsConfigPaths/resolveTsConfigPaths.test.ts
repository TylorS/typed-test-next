import { describe, given, it } from '@build/shared/domain'
import { findTsConfig } from '@build/shared/infrastructure'
import assert from 'assert'
import { join } from 'path'

import { createResolveTsConfigPaths } from './resolveTsConfigPaths'

const testFixtures = join(__dirname, '__test_fixtures__')

export const test = describe(`resolveTsConfigPaths`, [
  given(`a TsConfig with paths configured`, [
    it(`creates path resolver`, () => {
      const tsConfig = findTsConfig({ directory: testFixtures })
      const { isInPaths, resolvePath } = createResolveTsConfigPaths({ tsConfig })

      assert.ok(isInPaths('@foobar/index.ts'))
      assert.deepStrictEqual(undefined, resolvePath('@foobar/index.ts'))

      assert.ok(isInPaths('@foobar/bar.ts'))
      assert.deepStrictEqual(join(testFixtures, 'bar/bar.ts'), resolvePath('@foobar/bar.ts'))

      assert.ok(!isInPaths('@bar/bar.ts'))
    }),
  ]),
])
