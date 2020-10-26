import { Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'
import { Path } from '@typed/fp/Path/exports'

export const UPDATE_DEPENDENCIES = Symbol()
export type UPDATE_DEPENDENCIES = typeof UPDATE_DEPENDENCIES

export interface UpdateDependencies
  extends Op<UPDATE_DEPENDENCIES, (path: Path) => Pure<ReadonlySet<Path>>> {}

export const UpdateDependencies = createOp<UpdateDependencies>(UPDATE_DEPENDENCIES)

export const updateDependencies = callOp(UpdateDependencies)
