import { Path } from '@typed/fp/Path/exports'
import { createSharedRef, SharedRef, wrapSharedMap } from '@typed/fp/SharedRef/exports'

export const DEPENDENCY_MAP = '@documents/sharedRef/DependencyMap'
export type DEPENDENCY_MAP = typeof DEPENDENCY_MAP

export interface DependencyMap extends SharedRef<DEPENDENCY_MAP, Map<Path, ReadonlySet<Path>>> {}

export const DependencyMap = createSharedRef<DependencyMap>(DEPENDENCY_MAP)

export const dependencyMap = wrapSharedMap(DependencyMap)
