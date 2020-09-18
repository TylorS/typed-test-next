import { iso, Newtype } from 'newtype-ts'

/**
 * Represents the environment in which a test is being run
 */
export interface Environment extends Newtype<{ readonly Environment: unique symbol }, string> {}

export namespace Environment {
  export const { wrap, unwrap } = iso<Environment>()
}
