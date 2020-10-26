import { pathEq } from '@typed/fp/Path/exports'
import { difference } from 'fp-ts/ReadonlySet'

export const diffPaths = difference(pathEq)
