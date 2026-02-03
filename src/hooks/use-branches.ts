import useSWR, { type KeyedMutator } from 'swr'
import {
  deleteBranch,
  getAllBranches,
  toggleBranchStatus,
} from '~/actions/branches'

type BranchesData = Awaited<ReturnType<typeof getAllBranches>>
type BranchItem = BranchesData extends Array<infer Item> ? Item : never

const updateBranchList = (
  current: BranchesData | undefined,
  branchId: string,
  updater: (branch: BranchItem) => BranchItem
) => {
  if (!current) return []
  return current.map((branch) =>
    branch.id === branchId ? updater(branch) : branch
  )
}

const removeBranchFromList = (
  current: BranchesData | undefined,
  branchId: string
) => {
  if (!current) return []
  return current.filter((branch) => branch.id !== branchId)
}

export function useBranches() {
  return useSWR<BranchesData>('branches', getAllBranches)
}

export function useBranchMutations(mutate: KeyedMutator<BranchesData>) {
  const handleToggleStatus = async (branchId: string) => {
    const optimistic = (current?: BranchesData) =>
      updateBranchList(current, branchId, (branch) => ({
        ...branch,
        isActive: !branch.isActive,
      }))

    return mutate(
      async (current) => {
        await toggleBranchStatus(branchId)
        return optimistic(current)
      },
      {
        optimisticData: (current) => optimistic(current),
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
        throwOnError: true,
      }
    )
  }

  const handleDelete = async (branchId: string) => {
    const optimistic = (current?: BranchesData) =>
      removeBranchFromList(current, branchId)

    return mutate(
      async (current) => {
        const result = await deleteBranch(branchId)
        if (!result.success) {
          throw new Error(result.message ?? 'Error al eliminar sucursal')
        }
        return optimistic(current)
      },
      {
        optimisticData: (current) => optimistic(current),
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
        throwOnError: true,
      }
    )
  }

  return { handleToggleStatus, handleDelete }
}
