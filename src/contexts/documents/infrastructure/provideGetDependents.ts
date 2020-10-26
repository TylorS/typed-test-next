import { GetDependents } from '@documents/application/services'
import { doEffect } from '@typed/fp/Effect/exports'
import { provideOp } from '@typed/fp/Op/exports'
import { Path } from '@typed/fp/Path/exports'
import { pipe } from 'fp-ts/function'
import { getOrElse, isNone } from 'fp-ts/Option'

import { dependentMap } from './sharedRefs'

export const provideGetDependents = provideOp(GetDependents, (path) => {
  const eff = doEffect(function* () {
    const option = yield* dependentMap.get(path)
    const set = pipe(
      option,
      getOrElse(() => new Set()),
    )

    if (isNone(option)) {
      return yield* dependentMap.set(path, set)
    }

    return yield* getAllDependents(new Set(set))
  })

  return eff
})

const getAllDependents = (dependents: Set<Path>) =>
  doEffect(function* () {
    const documentsToProcess = Array.from(dependents)

    while (documentsToProcess.length > 0) {
      const documentToProcess = documentsToProcess.shift() as Path
      const documentDependents = yield* dependentMap.get(documentToProcess)

      if (isNone(documentDependents)) {
        continue
      }

      documentDependents.value.forEach((path) => {
        dependents.add(path)
        documentsToProcess.push(path)
      })
    }

    return dependents
  })
