import { GetDependencies } from '@documents/application/services'
import { doEffect } from '@typed/fp/Effect/exports'
import { provideOp } from '@typed/fp/Op/exports'
import { Path } from '@typed/fp/Path/exports'
import { pipe } from 'fp-ts/function'
import { getOrElse } from 'fp-ts/Option'

import { dependencyMap } from './sharedRefs'

export const provideGetDependencies = provideOp(GetDependencies, (path) =>
  doEffect(function* () {
    const option = yield* dependencyMap.get(path)

    return pipe(
      option,
      getOrElse((): ReadonlySet<Path> => new Set()),
    )
  }),
)
