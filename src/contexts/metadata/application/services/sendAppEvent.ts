import { ApplicationEvent } from '@metadata/application/events'
import { Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'

export const SEND_APP_EVENT = Symbol()
export type SEND_APP_EVENT = typeof SEND_APP_EVENT

export interface SendAppEvent extends Op<SEND_APP_EVENT, (event: ApplicationEvent) => Pure<void>> {}

export const SendAppEvent = createOp<SendAppEvent>(SEND_APP_EVENT)

export const sendAppEvent = callOp(SendAppEvent)
