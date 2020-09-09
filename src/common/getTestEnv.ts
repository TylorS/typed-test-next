import { asks, Effect } from '@typed/fp/Effect'

import { TestEnv, TYPED_TEST } from '../model'

export const getTestEnv: Effect<TestEnv, TestEnv[TYPED_TEST]> = asks((e: TestEnv) => e[TYPED_TEST])
