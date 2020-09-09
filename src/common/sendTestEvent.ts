import { ask, doEffect, Effect } from '@typed/fp/Effect'
import { SchedulerEnv } from '@typed/fp/fibers'

import { TestEnv, TestEvent } from '../model'
import { getTestEnv } from './getTestEnv'

export const sendTestEvent = (event: TestEvent): Effect<TestEnv & SchedulerEnv, void> => {
  const eff = doEffect(function* () {
    const { scheduler } = yield* ask()
    const { events } = yield* getTestEnv
    const [sink] = events

    sink.event(scheduler.currentTime(), event)
  })

  return eff
}
