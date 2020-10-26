import { Test, TestModifier, UpdateTestModifier } from '@build/shared/domain/model'

export const updateTestModifer = <M extends TestModifier>(modifier: M) => <T extends Test>(
  test: T,
): UpdateTestModifier<T, M> => {
  return ({
    ...test,
    config: { ...test.config, modifier },
  } as unknown) as UpdateTestModifier<T, M>
}

export const only = updateTestModifer('only')
export const skip = updateTestModifer('skip')
export const todo = updateTestModifer('todo')
