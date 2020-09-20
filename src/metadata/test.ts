import { EOL } from 'os'
import { join } from 'path'
import { Project } from 'ts-morph'

import { findExportedTests } from './findExportedTests'

const shouldPrintNode = process.argv.includes('--print')

const fixtures = join(__dirname, '__fixtures__')

const project = new Project()

const getFixture = (name: string) => project.addSourceFileAtPath(join(fixtures, name + '.ts'))

const testFiles = ['it-example', 'export-assignment', 'export-declarations'].map(getFixture)

const exportsMetadata = testFiles.flatMap(findExportedTests)

for (const metadata of exportsMetadata) {
  console.log(
    EOL + metadata.documentUri,
    metadata.exportNames,
    shouldPrintNode ? EOL + EOL + metadata.node.getText() : '',
  )
}

console.log()
