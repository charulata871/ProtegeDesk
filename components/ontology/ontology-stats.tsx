'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOntology } from '@/lib/ontology/context'
import { Box, Link2, User } from 'lucide-react'

export function OntologyStats() {
  const { ontology } = useOntology()

  if (!ontology) {
    return null
  }

  const classCount = ontology.classes.size
  const propertyCount = ontology.properties.size
  const individualCount = ontology.individuals.size

  return (
    <div className="space-y-3">
      <h3 className="px-1 text-sm font-semibold">Ontology Statistics</h3>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Box className="text-primary h-4 w-4" />
            Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{classCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Link2 className="text-primary h-4 w-4" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{propertyCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="text-primary h-4 w-4" />
            Individuals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{individualCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Ontology Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div>
            <div className="text-muted-foreground">IRI:</div>
            <div className="font-mono break-all">{ontology.id}</div>
          </div>
          {ontology.version && (
            <div>
              <div className="text-muted-foreground">Version:</div>
              <div className="font-mono">{ontology.version}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
