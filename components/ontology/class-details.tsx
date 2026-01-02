'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useOntology } from '@/lib/ontology/context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Copy, ChevronRight, Home } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export function ClassDetails() {
  const { selectedClass, ontology, selectClass } = useOntology()
  const { toast } = useToast()

  const breadcrumbs = useMemo(() => {
    if (!selectedClass || !ontology) {
      return []
    }

    const path: { id: string; label: string }[] = []
    let currentId = selectedClass.id
    const visited = new Set<string>()

    while (currentId && currentId !== 'owl:Thing' && !visited.has(currentId)) {
      visited.add(currentId)
      const cls = ontology.classes.get(currentId)
      if (cls) {
        path.unshift({ id: cls.id, label: cls.label || cls.name })
        currentId = cls.superClasses[0] // Follow first parent for breadcrumb
      } else {
        break
      }
    }

    path.unshift({ id: 'owl:Thing', label: 'owl:Thing' })
    return path
  }, [selectedClass, ontology])

  if (!selectedClass) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Select a class to view details
      </div>
    )
  }

  const subclasses = Array.from(ontology?.classes.values() || []).filter(ontologyClass =>
    ontologyClass.superClasses.includes(selectedClass.id)
  )

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <div className="text-muted-foreground bg-muted/30 border-border/50 flex flex-wrap items-center gap-1 rounded-md border p-2 text-xs">
          <Home className="mr-1 h-3 w-3" />
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center">
              {index > 0 && <ChevronRight className="mx-0.5 h-3 w-3" />}
              <button
                onClick={() => crumb.id !== 'owl:Thing' && selectClass(crumb.id)}
                className={cn(
                  'hover:text-primary decoration-primary/30 underline-offset-2 transition-colors hover:underline',
                  crumb.id === selectedClass.id && 'text-foreground font-semibold',
                  crumb.id === 'owl:Thing' && 'cursor-default hover:no-underline'
                )}
              >
                {crumb.label}
              </button>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Class Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="class-id" className="text-xs">
                ID
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="class-id"
                  value={selectedClass.id}
                  readOnly
                  className="flex-1 font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedClass.id)
                    toast({
                      title: 'Copied to clipboard',
                      description: 'The entity IRI has been copied.',
                    })
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-name" className="text-xs">
                Name
              </Label>
              <Input id="class-name" value={selectedClass.name} readOnly className="text-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-label" className="text-xs">
                Label
              </Label>
              <Input
                id="class-label"
                value={selectedClass.label || ''}
                readOnly
                className="text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-description" className="text-xs">
                Description
              </Label>
              <Textarea
                id="class-description"
                value={selectedClass.description || ''}
                readOnly
                rows={3}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hierarchy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Superclasses</Label>
              <div className="flex flex-wrap gap-2">
                {selectedClass.superClasses.length > 0 ? (
                  selectedClass.superClasses.map(superClass => (
                    <Badge key={superClass} variant="secondary" className="font-mono text-xs">
                      {superClass}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">None</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Subclasses ({subclasses.length})</Label>
              <div className="flex flex-wrap gap-2">
                {subclasses.length > 0 ? (
                  subclasses.map(subclass => (
                    <Badge key={subclass.id} variant="outline" className="font-mono text-xs">
                      {subclass.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">None</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Relationships</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Disjoint With</Label>
              <div className="flex flex-wrap gap-2">
                {selectedClass.disjointWith.length > 0 ? (
                  selectedClass.disjointWith.map(disjoint => (
                    <Badge key={disjoint} variant="destructive" className="font-mono text-xs">
                      {disjoint}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">None</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Properties ({selectedClass.properties.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedClass.properties.length > 0 ? (
                  selectedClass.properties.map(prop => (
                    <Badge key={prop} className="font-mono text-xs">
                      {prop}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">None</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Annotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedClass.annotations.length > 0 ? (
                selectedClass.annotations.map((annotation, index) => (
                  <div key={index} className="flex gap-2 text-xs">
                    <span className="text-primary font-mono">{annotation.property}:</span>
                    <span className="text-muted-foreground">{annotation.value}</span>
                  </div>
                ))
              ) : (
                <span className="text-muted-foreground text-xs">No annotations</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
