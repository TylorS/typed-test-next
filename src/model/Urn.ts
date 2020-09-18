import { Iso } from 'monocle-ts'
import { iso, Newtype } from 'newtype-ts'

/** Universal Resource Namespace
 * @example
 * 'http'
 * 'https'
 * 'ftp'
 * 'sftp'
 */
export interface Urn extends Newtype<{ readonly Urn: unique symbol }, string> {}

export const urnIso: Iso<Urn, string> = iso<Urn>()

export namespace Urn {
  export const { wrap, unwrap } = urnIso
}
