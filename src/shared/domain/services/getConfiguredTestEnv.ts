import { TestConfig, TestEnv, TestModifier, TYPED_TEST } from '@build/shared/domain/model'
import { asks, Effect } from '@typed/fp/Effect'
import { identity, pipe } from 'fp-ts/function'
import { fold, fromNullable } from 'fp-ts/Option'

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
          fromNullable,
          fold(() => env[TYPED_TEST].timeout, identity),
        ),
      },
    }),
  )

const getConfiguredModifer = (current: TestModifier, incoming: TestModifier): TestModifier =>
  current === 'default' ? incoming : current
