import { fromEnv } from '@typed/fp/Effect/fromEnv'
import { Path } from '@typed/fp/Path/exports'
import { Resume } from '@typed/fp/Resume/Resume'
import { Either } from 'fp-ts/Either'

export interface WriteDocumentEnv {
  readonly writeDocument: (path: Path, contents: string) => Resume<Either<Error, string>>
}

export const writeDocument = (path: Path, contents: string) =>
  fromEnv((e: WriteDocumentEnv) => e.writeDocument(path, contents))
