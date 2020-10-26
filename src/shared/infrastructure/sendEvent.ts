import { Scheduler } from '@most/types'
import { Subject } from 'most-subject'

export function sendEvent<A, B>(subject: Subject<A, B>, scheduler: Scheduler, value: A) {
  const [sink] = subject

  sink.event(scheduler.currentTime(), value)
}
