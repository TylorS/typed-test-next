import { ApplicationEvent } from '@bundle/application/events'
import { Arity1 } from '@typed/fp/common/types'
import { Disposable } from '@typed/fp/Disposable/exports'
import { Effect, Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'
import { Refinement } from 'fp-ts/function'

export const LISTEN_TO_APP_EVENT = Symbol()
export type LISTEN_TO_APP_EVENT = typeof LISTEN_TO_APP_EVENT

export interface ListenToAppEvent
  extends Op<
    LISTEN_TO_APP_EVENT,
    <A extends ApplicationEvent>(
      refinement: Refinement<ApplicationEvent, A>,
      handler: Arity1<A, Disposable>,
    ) => Pure<Disposable>
  > {}

export const ListenToAppEvent = createOp<ListenToAppEvent>(LISTEN_TO_APP_EVENT)

export const listenToAppEvent = callOp(ListenToAppEvent)

declare module '@typed/fp/cjs/Op/Op' {
  export interface Ops<Env> {
    readonly [LISTEN_TO_APP_EVENT]: <A extends ApplicationEvent>(
      refinement: Refinement<ApplicationEvent, A>,
      handler: Arity1<A, Disposable>,
    ) => Effect<Env, Disposable>
  }
}
