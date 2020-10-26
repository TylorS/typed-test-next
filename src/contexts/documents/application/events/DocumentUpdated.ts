import { createSchema } from '@typed/fp/io/exports'
import { Path, pathSchema } from '@typed/fp/Path/exports'

export interface DocumentUpdated {
  readonly type: 'document/updated'
  readonly path: Path
}

export namespace DocumentUpdated {
  export const schema = createSchema<DocumentUpdated>((t) =>
    t.type<DocumentUpdated>({
      type: t.literal('document/updated'),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      path: pathSchema(t),
    }),
  )
}
