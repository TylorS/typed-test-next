import { createSchema } from '@typed/fp/io/exports'
import { Path, pathSchema } from '@typed/fp/Path/exports'

export interface DocumentRenamed {
  readonly type: 'document/renamed'
  readonly previousPath: Path
  readonly path: Path
}

export namespace DocumentRenamed {
  export const schema = createSchema<DocumentRenamed>((t) =>
    t.type<DocumentRenamed>({
      type: t.literal('document/renamed'),
      previousPath: pathSchema(t),
      path: pathSchema(t),
    }),
  )
}
