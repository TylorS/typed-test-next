import { multicast, newStream, throwError } from '@most/core'
import { Stream } from '@most/types'
import { ArgsOf, HeadArg } from '@typed/fp/common'
import { lazy } from '@typed/fp/Disposable'
import { Path, pathJoin } from '@typed/fp/Path'
import { Uri } from '@typed/fp/Uri'
import nsfw from 'nsfw'

import { DocumentEvent, getUrn, TestEventType, Urn } from '../model'
import { DocumentWatcher } from './DocumentWatcher'

// Gross hidden types
type NsfwFileChangeEvent = HeadArg<ArgsOf<typeof nsfw>[1]>[0]

export class FileWatcher implements DocumentWatcher {
  readonly urns = ['file'].map(Urn.wrap)

  readonly #watchers = new Map<Path, Stream<DocumentEvent>>()

  constructor(private readonly debounceMs: number) {}

  readonly watchDirectory = (directory: Uri): Stream<DocumentEvent> => {
    if (!this.urns.includes(getUrn(directory))) {
      return throwError(new Error(`Unsupported Urn: ${directory}`))
    }

    const path = getPathFromUri(directory)

    if (this.#watchers.has(path)) {
      return this.#watchers.get(path)!
    }

    const stream = createDocumentEventStream(path, this.debounceMs, () =>
      this.#watchers.delete(path),
    )

    this.#watchers.set(path, stream)

    return stream
  }
}

function createDocumentEventStream(
  path: Path,
  debounceMS: number,
  cleanup: () => void,
): Stream<DocumentEvent> {
  const stream = newStream((sink, scheduler) => {
    const disposable = lazy()

    async function run() {
      const { start, stop } = await nsfw(
        Path.unwrap(path),
        (events) => {
          const documentEvents = events.map(convertEvent)

          for (const documentEvent of documentEvents) {
            sink.event(scheduler.currentTime(), documentEvent)
          }
        },
        { debounceMS },
      )

      if (!disposable.disposed) {
        disposable.addDisposable({ dispose: cleanup })
        disposable.addDisposable({ dispose: stop })

        await start()
      }
    }

    run()

    return disposable
  })

  return multicast(stream)
}

function getPathFromUri(directory: Uri): Path {
  return Path.wrap(Uri.unwrap(directory).split('://')[1])
}

function convertEvent(event: NsfwFileChangeEvent): DocumentEvent {
  switch (event.action) {
    case nsfw.actions.CREATED:
    case nsfw.actions.MODIFIED:
      return {
        type: TestEventType.DocumentUpdated,
        uri: createFileUri(event.directory, event.file),
      }
    case nsfw.actions.DELETED:
      return {
        type: TestEventType.DocumentDeleted,
        uri: createFileUri(event.directory, event.file),
      }
    case nsfw.actions.RENAMED:
      return {
        type: TestEventType.DocumentRenamed,
        // event is missing type of .directory
        previousUri: createFileUri((event as any).directory, event.oldFile),
        uri: createFileUri(event.newDirectory, event.newFile),
      }
  }
}

function createFileUri(directory: string, file: string): Uri {
  return Uri.wrap(Path.unwrap(pathJoin([directory, file])))
}
