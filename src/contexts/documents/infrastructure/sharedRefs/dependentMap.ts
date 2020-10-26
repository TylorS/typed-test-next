import { Path } from '@typed/fp/Path/exports'
import { createSharedRef, SharedRef, wrapSharedMap } from '@typed/fp/SharedRef/exports'

export const DEPENDENT_MAP = '@documents/sharedRef/DependentMap'
export type DEPENDENT_MAP = typeof DEPENDENT_MAP

export interface DependentMap extends SharedRef<DEPENDENT_MAP, Map<Path, Set<Path>>> {}

export const DependentMap = createSharedRef<DependentMap>(DEPENDENT_MAP)

export const dependentMap = wrapSharedMap(DependentMap)
