import useSWR from 'swr'
import {
  deleteBranch,
  getAllBranches,
  toggleBranchStatus,
} from '~/actions/branches'

export function useBranches() {
  return useSWR('branches', getAllBranches)
}

export function useBranchMutations(mutate: () => void) {
  const handleToggleStatus = async (branchId: string) => {
    await toggleBranchStatus(branchId)
    mutate()
  }

  const handleDelete = async (branchId: string) => {
    await deleteBranch(branchId)
    mutate()
  }

  return { handleToggleStatus, handleDelete }
}
