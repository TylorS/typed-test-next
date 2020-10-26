import { ApplicationEvent } from '@bundle/application/events'
import { createSharedRef, readSharedRef, SharedRef } from '@typed/fp/SharedRef/exports'
import { Subject } from 'most-subject'

export const APPLICATION_EVENTS = '@bundle/sharedRef/ApplicationEvents'
export type APPLICATION_EVENTS = typeof APPLICATION_EVENTS

export interface ApplicationEvents
  extends SharedRef<APPLICATION_EVENTS, Subject<ApplicationEvent, ApplicationEvent>> {}

export const ApplicationEvents = createSharedRef<ApplicationEvents>(APPLICATION_EVENTS)

export const getApplicationEvents = readSharedRef(ApplicationEvents)
