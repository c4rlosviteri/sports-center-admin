import { NextResponse } from 'next/server'
import { getSession } from '~/actions/auth'
import { getAllPackageTemplates } from '~/actions/packages'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const packages = await getAllPackageTemplates()

    return NextResponse.json({ packages })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}
