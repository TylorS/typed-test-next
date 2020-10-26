import { createSchema } from '@typed/fp/io/exports'
import { Prism } from 'monocle-ts'
import { iso, Newtype, prism } from 'newtype-ts'

// All positive integers
export interface DocumentVersion extends Newtype<'DocumentVersion', number> {}

export namespace DocumentVersion {
  export const { wrap, unwrap } = iso<DocumentVersion>()

  const { getOption }: Prism<number, DocumentVersion> = prism<DocumentVersion>(
    (n) => Number.isInteger(n) && n > 0,
  )

  export const schema = createSchema((t) =>
    t.newtype<DocumentVersion>(t.number, getOption, 'DocumentVersion'),
  )
}
