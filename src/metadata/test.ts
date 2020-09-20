import { join } from 'path'
import { Project } from 'ts-morph'

import { findExportedTests } from './findExportedTests'

const fixtures = join(__dirname, '__fixtures__')
const testFile = join(fixtures, 'it-example.ts')

const project = new Project()
const sourceFile = project.addSourceFileAtPath(testFile)

const exportsMetadata = findExportedTests(sourceFile)

for (const metadata of exportsMetadata) {
  console.log(metadata.documentUri, metadata.exportNames)
}
