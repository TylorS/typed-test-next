import { filter } from '@most/core'
import { doEffect } from '@typed/fp/Effect/exports'
import { useMemo, useStream } from '@typed/fp/hooks/exports'
import { provideOp } from '@typed/fp/Op/exports'

import { ListenToAppEvent } from '../application/services/listenToAppEvent'
import { getApplicationEvents } from './sharedRefs/applicationEvents'

export const provideListenToAppEvents = provideOp(ListenToAppEvent, (refinement, handler) => {
  const eff = doEffect(function* () {
    const [, stream] = yield* getApplicationEvents
    const filtered = yield* useMemo(filter(refinement), [stream])

    return yield* useStream(filtered, handler)
  })

  return eff
})
