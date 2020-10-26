import { Path } from '@typed/fp'
import { createSchema } from '@typed/fp/io/exports'
import { pathSchema } from '@typed/fp/Path/exports'

import { DocumentVersion } from './DocumentVersion'

export interface Document {
  readonly path: Path
  // Version to the contents at that version
  readonly versions: ReadonlyMap<DocumentVersion, string>
}

export namespace Document {
  export const fromPath = (path: Path): Document => ({ path, versions: new Map() })

  export const schema = createSchema<Document>((t) =>
    t.type({
      path: pathSchema(t),
      versions: t.map(DocumentVersion.schema(t), t.string),
    }),
  )
}
