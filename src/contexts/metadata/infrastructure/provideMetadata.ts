import { ListenToAppEvent, ParseTestMetadata, SendAppEvent } from '@metadata/application'
import { Effect, EnvOf } from '@typed/fp/Effect/Effect'
import { OpEnvs } from '@typed/fp/Op/exports'
import { provideSharedRef, SharedRefEnv } from '@typed/fp/SharedRef/exports'
import { pipe } from 'fp-ts/function'
import { create } from 'most-subject'

import { provideListenToAppEvents } from './provideListenToAppEvents'
import { provideParseTestMetadata } from './provideParseTestMetadata'
import { provideSendAppEvent } from './provideSendAppEvent'
import { ApplicationEvents } from './sharedRefs/applicationEvents'

export type ProvidedEnv = OpEnvs<[ListenToAppEvent, ParseTestMetadata, SendAppEvent]> &
  SharedRefEnv<ApplicationEvents>

export type MetadataEnv = EnvOf<typeof provideListenToAppEvents> &
  EnvOf<typeof provideSendAppEvent> &
  EnvOf<typeof provideParseTestMetadata>

export const provideMetadata = <E, A>(
  effect: Effect<E & ProvidedEnv, A>,
): Effect<E & MetadataEnv, A> =>
  pipe(
    effect,
    provideListenToAppEvents,
    provideSendAppEvent,
    provideParseTestMetadata,
    provideSharedRef(ApplicationEvents, create()),
  )
