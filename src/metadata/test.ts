import { isBrowser } from '@typed/fp/common'
import { doEffect, execEffect, zip } from '@typed/fp/Effect'
import { createBrowserUuidEnv, createNodeUuidEnv } from '@typed/fp/Uuid'
import { flow } from 'fp-ts/function'
import { EOL } from 'os'
import { join } from 'path'
import { Project } from 'ts-morph'

import { findExportedTests } from './findExportedTests'
import { findNodeMetadata } from './findNodeMetadata'
// import { findTestMetadata } from './findTestMetadata'

const FIXTURES_PATH = join(__dirname, '__fixtures__')
const SHOULD_PRINT_NODE = process.argv.includes('--print')

const TEST_FILES = ['it-example', 'export-assignment', 'export-declarations']

function main() {
  return doEffect(function* () {
    const project = new Project()
    const getFixture = (name: string) =>
      project.addSourceFileAtPath(join(FIXTURES_PATH, name + '.ts'))

    console.log('Finding ExportMetadata...')

    const exportsMetadata = TEST_FILES.flatMap(flow(getFixture, findExportedTests))

    for (const metadata of exportsMetadata) {
      console.log(
        EOL + metadata.documentUri,
        metadata.exportNames,
        SHOULD_PRINT_NODE ? EOL + EOL + metadata.node.getText() : '',
      )
    }

    console.log(EOL + 'Finding TestMetadata...')

    const testMetadata = yield* zip(exportsMetadata.map((m) => findNodeMetadata(m.node)))

    for (const metadata of testMetadata) {
      console.log(EOL + JSON.stringify(metadata, null, 2))
    }

    console.log()
  })
}

execEffect(isBrowser ? createBrowserUuidEnv() : createNodeUuidEnv(), main())
