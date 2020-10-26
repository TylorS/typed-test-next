import { SendAppEvent } from '@metadata/application'
import { ask, doEffect } from '@typed/fp/Effect/exports'
import { SchedulerEnv } from '@typed/fp/fibers/exports'
import { provideOp } from '@typed/fp/Op/exports'

import { getApplicationEvents } from './sharedRefs/applicationEvents'

export const provideSendAppEvent = provideOp(SendAppEvent, (event) =>
  doEffect(function* () {
    const { scheduler } = yield* ask<SchedulerEnv>()
    const [sink] = yield* getApplicationEvents

    sink.event(scheduler.currentTime(), event)
  }),
)
