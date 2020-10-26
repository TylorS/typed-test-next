import { WatchDirectory } from '@documents/application/services'
import { ask, doEffect } from '@typed/fp/Effect/exports'
import { provideOp } from '@typed/fp/Op/exports'

import { FileWatcher } from './createFileWatcher'

export interface FileWatcherEnv {
  readonly fileWatcher: FileWatcher
}

export const provideWatchDirectory = provideOp(WatchDirectory, (path) =>
  doEffect(function* () {
    const { fileWatcher } = yield* ask<FileWatcherEnv>()

    return fileWatcher.watchDirectory(path)
  }),
)
