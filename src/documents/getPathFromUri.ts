import { Path } from '@typed/fp'
import { parseUri, Uri } from '@typed/fp/Uri'

export function getPathFromUri(uri: Uri): Path {
  return parseUri(uri).pathname
}
