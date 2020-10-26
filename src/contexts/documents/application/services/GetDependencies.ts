import { Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'
import { Path } from '@typed/fp/Path/exports'

export const GET_DEPENDENCIES = Symbol()
export type GET_DEPENDENCIES = typeof GET_DEPENDENCIES

export interface GetDependencies
  extends Op<GET_DEPENDENCIES, (path: Path) => Pure<ReadonlySet<Path>>> {}

export const GetDependencies = createOp<GetDependencies>(GET_DEPENDENCIES)

export const getDependencies = callOp(GetDependencies)
