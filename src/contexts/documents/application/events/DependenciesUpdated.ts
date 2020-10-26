import { Document } from '@documents/domain'
import { createSchema } from '@typed/fp/io/exports'
import { Path, pathSchema } from '@typed/fp/Path/exports'

export interface DependenciesUpdated {
  readonly type: 'dependencies/updated'
  readonly document: Document
  readonly dependencies: readonly Path[]
}

export namespace DependenciesUpdated {
  export const schema = createSchema<DependenciesUpdated>((t) =>
    t.type<DependenciesUpdated>({
      type: t.literal('dependencies/updated'),
      document: Document.schema(t),
      dependencies: t.array(pathSchema(t)),
    }),
  )
}
