import { findSourceFileDependencies, TsConfigPathsResolver } from '@build/shared'
import { UpdateDependencies } from '@documents/application/services'
import { ask, doEffect } from '@typed/fp/Effect/exports'
import { provideOp } from '@typed/fp/Op/exports'
import { Path } from '@typed/fp/Path/exports'
import { Project } from 'ts-morph'

import { dependencyMap } from './sharedRefs'

export type ProjectEnv = {
  readonly project: Project
}

export type PathsResolverEnv = {
  readonly pathsResolver: TsConfigPathsResolver
}

// TODO: Do a diff on whether or not to actually bother updating dependencyMap

export const provideUpdateDependencies = provideOp(UpdateDependencies, (path) =>
  doEffect(function* () {
    const { project, pathsResolver } = yield* ask<ProjectEnv & PathsResolverEnv>()
    const file = Path.unwrap(path)
    const sourceFile = project.getSourceFile(file) ?? project.addSourceFileAtPath(file)
    const dependencies = new Set(findSourceFileDependencies(sourceFile, pathsResolver))

    return yield* dependencyMap.set(path, dependencies)
  }),
)
