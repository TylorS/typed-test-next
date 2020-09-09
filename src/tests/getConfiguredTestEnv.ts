import { asks, Effect } from '@typed/fp/Effect'
import { identity, pipe } from 'fp-ts/es6/function'
import { fold } from 'fp-ts/es6/Option'

import { TestConfig, TestEnv, TestModifier, TYPED_TEST } from '../model'

/**
 * Prepares the test environment for a particular Test based on its configuration
 */
export const getConiguredTestEnv = (config: TestConfig): Effect<TestEnv, TestEnv> =>
  asks(
    (env: TestEnv): TestEnv => ({
      ...env,
      [TYPED_TEST]: {
        ...env[TYPED_TEST],
        modifier: getConfiguredModifer(env[TYPED_TEST].modifier, config.modifier),
        timeout: pipe(
          config.timeout,
          fold(() => env[TYPED_TEST].timeout, identity),
        ),
      },
    }),
  )

const getConfiguredModifer = (current: TestModifier, incoming: TestModifier): TestModifier =>
  current === TestModifier.Default ? incoming : current
