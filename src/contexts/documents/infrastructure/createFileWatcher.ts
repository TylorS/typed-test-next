import { DocumentEvent } from '@documents/application/events'
import { multicast, newStream } from '@most/core'
import { Stream } from '@most/types'
import { ArgsOf, HeadArg } from '@typed/fp/common'
import { lazy } from '@typed/fp/Disposable'
import { Path, pathJoin } from '@typed/fp/Path'
import nsfw from 'nsfw'

// Gross hidden types
type NsfwFileChangeEvent = HeadArg<ArgsOf<typeof nsfw>[1]>[0]

export function createFileWatcher(debounceMs: number): FileWatcher {
  return new FileWatcher(debounceMs)
}

export class FileWatcher {
  readonly #watchers = new Map<Path, Stream<DocumentEvent>>()

  constructor(private readonly debounceMs: number) {}

  readonly watchDirectory = (directory: Path): Stream<DocumentEvent> => {
    if (this.#watchers.has(directory)) {
      return this.#watchers.get(directory)!
    }

    const stream = createDocumentEventStream(directory, this.debounceMs, () =>
      this.#watchers.delete(directory),
    )

    this.#watchers.set(directory, stream)

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

function convertEvent(event: NsfwFileChangeEvent): DocumentEvent {
  switch (event.action) {
    case nsfw.actions.CREATED:
    case nsfw.actions.MODIFIED:
      return {
        type: 'document/updated',
        path: createFilePath(event.directory, event.file),
      }
    case nsfw.actions.DELETED:
      return {
        type: 'document/deleted',
        path: createFilePath(event.directory, event.file),
      }
    case nsfw.actions.RENAMED:
      return {
        type: 'document/renamed',
        // event is missing type of .directory
        previousPath: createFilePath((event as any).directory, event.oldFile),
        path: createFilePath(event.newDirectory, event.newFile),
      }
  }
}

function createFilePath(directory: string, file: string): Path {
  return pathJoin([directory, file])
}
