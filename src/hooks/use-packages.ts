import useSWR from 'swr'
import {
  deletePackageTemplate,
  getAllPackageTemplates,
  type PackageTemplateInput,
  togglePackageStatus,
  updatePackageTemplate,
} from '~/actions/packages'

export function usePackages() {
  return useSWR('packages', getAllPackageTemplates)
}

export function usePackageMutations(mutate: () => void) {
  const handleToggleStatus = async (packageId: string, newStatus: boolean) => {
    await togglePackageStatus(packageId, newStatus)
    mutate()
  }

  const handleDelete = async (packageId: string) => {
    await deletePackageTemplate(packageId)
    mutate()
  }

  const handleUpdate = async (
    packageId: string,
    input: Partial<PackageTemplateInput>
  ) => {
    await updatePackageTemplate(packageId, input)
    mutate()
  }

  return { handleToggleStatus, handleDelete, handleUpdate }
}
