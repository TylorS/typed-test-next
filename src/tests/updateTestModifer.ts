import { Test, TestModifier, UpdateTestModifier } from '../model'

export const updateTestModifer = <M extends TestModifier>(modifier: M) => <T extends Test>(
  test: T,
): UpdateTestModifier<T, M> => {
  return ({
    ...test,
    config: { ...test.config, modifier },
  } as unknown) as UpdateTestModifier<T, M>
}

export const only = updateTestModifer(TestModifier.Only)
export const skip = updateTestModifer(TestModifier.Skip)
export const todo = updateTestModifer(TestModifier.Todo)
