import { createSchema } from '@typed/fp/io/exports'
import { Path, pathSchema } from '@typed/fp/Path/exports'

export interface DocumentDeleted {
  readonly type: 'document/deleted'
  readonly path: Path
}

export namespace DocumentDeleted {
  export const schema = createSchema<DocumentDeleted>((t) =>
    t.type<DocumentDeleted>({
      type: t.literal('document/deleted'),
      path: pathSchema(t),
    }),
  )
}
