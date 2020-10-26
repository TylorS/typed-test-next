import { TsConfigPathsResolver } from '@build/shared'
import { TestMetadata } from '@build/shared/domain'
import { Path } from '@typed/fp/Path/exports'
import { EOL } from 'os'
import * as tempy from 'tempy'

import { createResolvedImport } from './createResolvedImport'
import { generateTestImports } from './generateTestImports'
import { TestsByDocument } from './TestsByDocument'

export function generateTestBundleContent(
  testMetadata: ReadonlyArray<TestMetadata>,
  tsConfigPathsResolver: TsConfigPathsResolver,
  preferEsm: boolean,
) {
  const testModulePath = tempy.file({ extension: 'ts' })
  const testsByDocument = groupTestMetadata(testMetadata)
  const metadataIdsByDocument = Array.from(testsByDocument).map(
    ([path, testMetadata]) => [path, testMetadata.map((t) => t.id)] as const,
  )
  const [idsByPath, testImports] = generateTestImports(testsByDocument)
  const resolve = (importNames: readonly string[], specifier: string) =>
    createResolvedImport(importNames, specifier, testModulePath, tsConfigPathsResolver, preferEsm)

  const contents = `${resolve(['doEffect', 'zip'], '@typed/fp/Effect/exports')}
${resolve(['createUuid'], '@typed/fp/Uuid/exports')}
${resolve(['Path'], '@typed/fp/Path/exports')}
${resolve(['none', 'some'], 'fp-ts/Option')}
${resolve(['getTestEnv'], '../common/getTestEnv')}
${resolve(['sendTestEvent'], '../common/sendTestEvent')}
${resolve(['runDocument'], '../tests/runDocument')}
${resolve(['TestEventType'], '../model/events')}
${resolve(['TestResult'], '../model/TestResult')}
${resolve(['CompletedTestRun', 'TestRun', 'TestRunId'], '../model/TestRun')}
${testImports.join(EOL)}

const testModulePath = Path.wrap(${JSON.stringify(testModulePath)})
const testsByDocument = [${idsByPath
    .map(([path, tests]) => `['${path}', [${tests.join(',')}]]`)
    .join(',')}] as const
const testMetadataByDocument = new Map(${JSON.stringify(metadataIdsByDocument)})

export const runTests = doEffect(function* () {
  const env = yield* getTestEnv

  const start = new Date()
  const testRun: TestRun = {
    id: TestRunId.wrap(yield* createUuid),
    testModulePath,
    environment: env.environment,
    timestamp: start,
    completion: none,
  }

  yield* sendTestEvent({ type: TestEventType.TestRunStarted, testRun })

  const documentResults: ReadonlyArray<ReadonlyArray<TestResult>> = yield* zip(
    testsByDocument.map(([path, tests]) =>
      runDocument(
        Path.wrap(path),
        tests,
        (testMetadataByDocument.get(path) ?? []) as readonly any[],
        testRun.id
      )
    ),
  )
  const results = documentResults.reduce((x: ReadonlyArray<TestResult>, y: ReadonlyArray<TestResult>) => x.concat(y), [] as ReadonlyArray<TestResult>)

  const completion = {
    timestamp: new Date(),
    results,
  }

  const completedTestRun: CompletedTestRun = {
    ...testRun,
    completion: some(completion) as any,
  }

  yield* sendTestEvent({ type: TestEventType.TestRunCompleted, testRun: completedTestRun })

  return results
})

`

  return { path: testModulePath, contents } as const
}

function groupTestMetadata(testMetadata: ReadonlyArray<TestMetadata>): TestsByDocument {
  const byPath = new Map<Path, Array<TestMetadata>>()

  for (const metadata of testMetadata) {
    appendTo(byPath, metadata.path, metadata)
  }

  return Array.from(byPath.entries())
}

function appendTo<A, B>(map: Map<A, Array<B>>, key: A, value: B) {
  const array = map.get(key) ?? map.set(key, []).get(key)!

  array.push(value)
}
