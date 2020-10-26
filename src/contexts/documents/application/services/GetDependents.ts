import { Pure } from '@typed/fp/Effect'
import { callOp, createOp, Op } from '@typed/fp/Op'
import { Path } from '@typed/fp/Path/exports'

export const GET_DEPENDENTS = Symbol()
export type GET_DEPENDENTS = typeof GET_DEPENDENTS

export interface GetDependents
  extends Op<GET_DEPENDENTS, (path: Path) => Pure<ReadonlySet<Path>>> {}

export const GetDependents = createOp<GetDependents>(GET_DEPENDENTS)

export const getDependents = callOp(GetDependents)
