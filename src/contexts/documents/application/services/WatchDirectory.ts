import { DocumentEvent } from '@documents/application/events'
import { Stream } from '@most/types'
import { Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'
import { Path } from '@typed/fp/Path/exports'

export const WATCH_DIRECTORY = Symbol()
export type WATCH_DIRECTORY = typeof WATCH_DIRECTORY

export interface WatchDirectory
  extends Op<WATCH_DIRECTORY, (path: Path) => Pure<Stream<DocumentEvent>>> {}

export const WatchDirectory = createOp<WatchDirectory>(WATCH_DIRECTORY)

export const watchDirectory = callOp(WatchDirectory)
