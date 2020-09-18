import { Uri } from '@typed/fp/Uri'
import { iso, Newtype } from 'newtype-ts'

/** Universal Resource Namespace
 * @example
 * 'http'
 * 'https'
 * 'ftp'
 * 'sftp'
 */
export interface Urn extends Newtype<{ readonly Urn: unique symbol }, string> {}

export namespace Urn {
  export const { wrap, unwrap } = iso<Urn>()
}

export function getUrn(uri: Uri): Urn {
  return Urn.wrap(Uri.unwrap(uri).split('://')[0])
}
