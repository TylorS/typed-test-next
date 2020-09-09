import { Newtype } from 'newtype-ts'

/** Universal Resource Namespace
 * @example
 * 'http'
 * 'https'
 * 'ftp'
 * 'sftp'
 */
export interface Urn extends Newtype<{ readonly Urn: unique symbol }, string> {}
