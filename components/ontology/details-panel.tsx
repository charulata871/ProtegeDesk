'use client'

import { useOntology } from '@/lib/ontology/context'
import { ClassDetails } from './class-details'
import { PropertyDetails } from './property-details'

export function DetailsPanel() {
  const { selectedClass, selectedProperty } = useOntology()

  if (selectedProperty) {
    return <PropertyDetails />
  }

  if (selectedClass) {
    return <ClassDetails />
  }

  return (
    <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
      Select an entity to view details
    </div>
  )
}
