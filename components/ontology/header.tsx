'use client'

import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { ImportExportDialog } from './import-export-dialog'
import { NewEntityDialog } from './new-entity-dialog'
import { ReasonerDialog } from './reasoner-dialog'

export function OntologyHeader() {
  return (
    <header className="border-border bg-card border-b">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-foreground text-lg font-semibold">
            Protege<span className="text-primary">TS</span>
          </h1>
          <span className="text-muted-foreground text-sm">Ontology Editor</span>
        </div>

        <div className="flex items-center gap-2">
          <NewEntityDialog />
          <ReasonerDialog />
          <ImportExportDialog />
          <Button variant="ghost" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    </header>
  )
}
