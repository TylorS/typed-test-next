import { Effect } from '@typed/fp/Effect'
import { Uri } from '@typed/fp/Uri'

import { TestEnv } from './TestEnv'
import { TestMetadata } from './TestMetadata'
import { TestResult } from './TestResult'

export interface TestModule {
  readonly testModuleUri: Uri // Uri of TestModule
  readonly testMetadata: ReadonlyArray<TestMetadata['id']> // What the module was created from
  readonly createdAt: Date // When TestModule was created
  readonly runTests: Effect<TestEnv, ReadonlyArray<TestResult>>
}
