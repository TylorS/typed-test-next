import { TestEnv, TestModule, TestResult } from '@build/shared/domain'
import { doEffect, Effect } from '@typed/fp/Effect/exports'
import { fromEnv } from '@typed/fp/Effect/fromEnv'
import { Path } from '@typed/fp/Path/exports'
import { Resume } from '@typed/fp/Resume/Resume'

export type RequireModuleEnv = {
  requireModule: (path: Path) => Resume<unknown>
}

const requireModule = (path: Path) => fromEnv((e: RequireModuleEnv) => e.requireModule(path))

export const runNode = (path: Path): Effect<RequireModuleEnv & TestEnv, readonly TestResult[]> => {
  const eff = doEffect(function* () {
    const { runTests } = (yield* requireModule(path)) as TestModule

    return yield* runTests
  })

  return eff
}
