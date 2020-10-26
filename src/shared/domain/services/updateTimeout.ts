import { Test, UpdatedTestTimeout } from '@build/shared/domain/model'
import { curry } from '@typed/fp/lambda'
import { some } from 'fp-ts/Option'

export const timeout = curry(
  <Timeout extends number, T extends Test>(
    timeout: Timeout,
    test: T,
  ): UpdatedTestTimeout<T, Timeout> => {
    return ({
      ...test,
      config: { ...test.config, timeout: some(timeout) },
    } as unknown) as UpdatedTestTimeout<T, Timeout>
  },
) as {
  <Timeout extends number, T extends Test>(timeout: Timeout, test: T): UpdatedTestTimeout<
    T,
    Timeout
  >

  <Timeout extends number>(timeout: Timeout): <T extends Test>(
    test: T,
  ) => UpdatedTestTimeout<T, Timeout>
}
