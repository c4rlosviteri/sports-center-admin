import useSWR, { type KeyedMutator } from 'swr'
import {
  deletePackageTemplate,
  getAllPackageTemplates,
  type PackageTemplateInput,
  togglePackageStatus,
  updatePackageTemplate,
} from '~/actions/packages'

type PackagesData = Awaited<ReturnType<typeof getAllPackageTemplates>>
type PackageItem = PackagesData extends Array<infer Item> ? Item : never

const updatePackageList = (
  current: PackagesData | undefined,
  packageId: string,
  updater: (pkg: PackageItem) => PackageItem
) => {
  if (!current) return []
  return current.map((pkg) => (pkg.id === packageId ? updater(pkg) : pkg))
}

const removePackageFromList = (
  current: PackagesData | undefined,
  packageId: string
) => {
  if (!current) return []
  return current.filter((pkg) => pkg.id !== packageId)
}

export function usePackages() {
  return useSWR<PackagesData>('packages', getAllPackageTemplates)
}

export function usePackageMutations(mutate: KeyedMutator<PackagesData>) {
  const handleToggleStatus = async (packageId: string, newStatus: boolean) => {
    const optimistic = (current?: PackagesData) =>
      updatePackageList(current, packageId, (pkg) => ({
        ...pkg,
        isActive: newStatus,
      }))

    return mutate(
      async (current) => {
        await togglePackageStatus(packageId, newStatus)
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

  const handleDelete = async (packageId: string) => {
    const optimistic = (current?: PackagesData) =>
      removePackageFromList(current, packageId)

    return mutate(
      async (current) => {
        await deletePackageTemplate(packageId)
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

  const handleUpdate = async (
    packageId: string,
    input: Partial<PackageTemplateInput>
  ) => {
    const optimistic = (current?: PackagesData) =>
      updatePackageList(current, packageId, (pkg) => {
        const nextValidityType = input.validityType ?? pkg.validityType
        const nextValidityPeriod =
          nextValidityType === 'unlimited'
            ? null
            : (input.validityPeriod ?? pkg.validityPeriod)

        const nextMaxClassesPerDay =
          input.maxClassesPerDay !== undefined
            ? input.maxClassesPerDay
            : (pkg.maxClassesPerDay ?? null)
        const nextMaxClassesPerWeek =
          input.maxClassesPerWeek !== undefined
            ? input.maxClassesPerWeek
            : (pkg.maxClassesPerWeek ?? null)

        return {
          ...pkg,
          name: input.name ?? pkg.name,
          description: input.description ?? pkg.description,
          classCount: input.classCount ?? pkg.classCount,
          price: input.price ?? pkg.price,
          validityType: nextValidityType,
          validityPeriod: nextValidityPeriod ?? null,
          maxClassesPerDay: nextMaxClassesPerDay,
          maxClassesPerWeek: nextMaxClassesPerWeek,
          isActive: input.isActive ?? pkg.isActive,
        }
      })

    return mutate(
      async (current) => {
        await updatePackageTemplate(packageId, input)
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

  return { handleToggleStatus, handleDelete, handleUpdate }
}
