import { serializeToJSONLD, serializeToTurtle, serializeToOWLXML } from '../serializers'
import type { Ontology, OntologyClass, OntologyProperty, Individual } from '../types'

describe('Ontology Serializers', () => {
  const createMockOntology = (): Ontology => ({
    id: 'http://example.org/test',
    name: 'Test Ontology',
    version: '1.0.0',
    imports: [],
    classes: new Map(),
    properties: new Map(),
    individuals: new Map(),
    annotations: [],
  })

  const createMockClass = (id: string, name: string): OntologyClass => ({
    id,
    name,
    label: name,
    description: `Description of ${name}`,
    superClasses: [],
    annotations: [],
    properties: [],
    disjointWith: [],
    equivalentTo: [],
  })

  const createMockProperty = (id: string, name: string): OntologyProperty => ({
    id,
    name,
    label: name,
    description: `Description of ${name}`,
    type: 'ObjectProperty',
    domain: [],
    range: [],
    superProperties: [],
    characteristics: [],
    annotations: [],
  })

  const createMockIndividual = (id: string, name: string): Individual => ({
    id,
    name,
    label: name,
    types: [],
    propertyAssertions: [],
    annotations: [],
    sameAs: [],
    differentFrom: [],
  })

  describe('serializeToJSONLD', () => {
    it('should serialize empty ontology to JSON-LD', () => {
      const ontology = createMockOntology()
      const result = serializeToJSONLD(ontology)
      const parsed = JSON.parse(result)

      expect(parsed['@context']).toBeDefined()
      expect(parsed['@id']).toBe('http://example.org/test')
      expect(parsed['@type']).toBe('owl:Ontology')
      expect(parsed['@graph']).toEqual([])
    })

    it('should include version info in JSON-LD', () => {
      const ontology = createMockOntology()
      ontology.version = '2.0.0'

      const result = serializeToJSONLD(ontology)
      const parsed = JSON.parse(result)

      expect(parsed['owl:versionInfo']).toBe('2.0.0')
    })

    it('should serialize classes to JSON-LD', () => {
      const ontology = createMockOntology()
      const testClass = createMockClass('http://example.org/Person', 'Person')
      ontology.classes.set(testClass.id, testClass)

      const result = serializeToJSONLD(ontology)
      const parsed = JSON.parse(result)

      expect(parsed['@graph']).toHaveLength(1)
      expect(parsed['@graph'][0]['@id']).toBe('http://example.org/Person')
      expect(parsed['@graph'][0]['@type']).toBe('owl:Class')
      expect(parsed['@graph'][0]['rdfs:label']).toBe('Person')
      expect(parsed['@graph'][0]['rdfs:comment']).toBe('Description of Person')
    })

    it('should serialize class hierarchy to JSON-LD', () => {
      const ontology = createMockOntology()
      const personClass = createMockClass('http://example.org/Person', 'Person')
      const studentClass = createMockClass('http://example.org/Student', 'Student')
      studentClass.superClasses = ['http://example.org/Person']

      ontology.classes.set(personClass.id, personClass)
      ontology.classes.set(studentClass.id, studentClass)

      const result = serializeToJSONLD(ontology)
      const parsed = JSON.parse(result)

      const student = parsed['@graph'].find((item: any) => item['@id'] === 'http://example.org/Student')
      expect(student['rdfs:subClassOf']).toEqual([{ '@id': 'http://example.org/Person' }])
    })

    it('should serialize properties to JSON-LD', () => {
      const ontology = createMockOntology()
      const prop = createMockProperty('http://example.org/hasAge', 'hasAge')
      prop.domain = ['http://example.org/Person']
      prop.range = ['http://www.w3.org/2001/XMLSchema#integer']

      ontology.properties.set(prop.id, prop)

      const result = serializeToJSONLD(ontology)
      const parsed = JSON.parse(result)

      const property = parsed['@graph'][0]
      expect(property['@id']).toBe('http://example.org/hasAge')
      expect(property['@type']).toBe('owl:ObjectProperty')
      expect(property['rdfs:domain']).toEqual([{ '@id': 'http://example.org/Person' }])
      expect(property['rdfs:range']).toEqual([{ '@id': 'http://www.w3.org/2001/XMLSchema#integer' }])
    })

    it('should serialize individuals to JSON-LD', () => {
      const ontology = createMockOntology()
      const individual = createMockIndividual('http://example.org/john', 'John')
      individual.types = ['http://example.org/Person']

      ontology.individuals.set(individual.id, individual)

      const result = serializeToJSONLD(ontology)
      const parsed = JSON.parse(result)

      const ind = parsed['@graph'][0]
      expect(ind['@id']).toBe('http://example.org/john')
      expect(ind['@type']).toEqual([{ '@id': 'http://example.org/Person' }])
      expect(ind['rdfs:label']).toBe('John')
    })

    it('should serialize disjoint classes to JSON-LD', () => {
      const ontology = createMockOntology()
      const animalClass = createMockClass('http://example.org/Animal', 'Animal')
      const plantClass = createMockClass('http://example.org/Plant', 'Plant')
      animalClass.disjointWith = ['http://example.org/Plant']

      ontology.classes.set(animalClass.id, animalClass)
      ontology.classes.set(plantClass.id, plantClass)

      const result = serializeToJSONLD(ontology)
      const parsed = JSON.parse(result)

      const animal = parsed['@graph'].find((item: any) => item['@id'] === 'http://example.org/Animal')
      expect(animal['owl:disjointWith']).toEqual([{ '@id': 'http://example.org/Plant' }])
    })

    it('should handle imports in JSON-LD', () => {
      const ontology = createMockOntology()
      ontology.imports = ['http://example.org/imported-ontology']

      const result = serializeToJSONLD(ontology)
      const parsed = JSON.parse(result)

      expect(parsed['owl:imports']).toEqual([{ '@id': 'http://example.org/imported-ontology' }])
    })
  })

  describe('serializeToTurtle', () => {
    it('should serialize empty ontology to Turtle', () => {
      const ontology = createMockOntology()
      const result = serializeToTurtle(ontology)

      expect(result).toContain('@prefix owl:')
      expect(result).toContain('@prefix rdfs:')
      expect(result).toContain('@prefix rdf:')
      expect(result).toContain('<http://example.org/test> a owl:Ontology')
    })

    it('should include version in Turtle', () => {
      const ontology = createMockOntology()
      ontology.version = '1.0.0'

      const result = serializeToTurtle(ontology)

      expect(result).toContain('owl:versionInfo "1.0.0"')
    })

    it('should serialize classes to Turtle', () => {
      const ontology = createMockOntology()
      const testClass = createMockClass('http://example.org/Person', 'Person')
      ontology.classes.set(testClass.id, testClass)

      const result = serializeToTurtle(ontology)

      expect(result).toContain('<http://example.org/Person> a owl:Class')
      expect(result).toContain('rdfs:label "Person"')
      expect(result).toContain('rdfs:comment "Description of Person"')
    })

    it('should serialize class hierarchy to Turtle', () => {
      const ontology = createMockOntology()
      const personClass = createMockClass('http://example.org/Person', 'Person')
      const studentClass = createMockClass('http://example.org/Student', 'Student')
      studentClass.superClasses = ['http://example.org/Person']

      ontology.classes.set(personClass.id, personClass)
      ontology.classes.set(studentClass.id, studentClass)

      const result = serializeToTurtle(ontology)

      expect(result).toContain('<http://example.org/Student> a owl:Class')
      expect(result).toContain('rdfs:subClassOf <http://example.org/Person>')
    })

    it('should serialize properties to Turtle', () => {
      const ontology = createMockOntology()
      const prop = createMockProperty('http://example.org/hasAge', 'hasAge')
      prop.type = 'DataProperty'
      prop.domain = ['http://example.org/Person']
      prop.range = ['http://www.w3.org/2001/XMLSchema#integer']

      ontology.properties.set(prop.id, prop)

      const result = serializeToTurtle(ontology)

      expect(result).toContain('<http://example.org/hasAge> a owl:DataProperty')
      expect(result).toContain('rdfs:domain <http://example.org/Person>')
      expect(result).toContain('rdfs:range <http://www.w3.org/2001/XMLSchema#integer>')
    })

    it('should serialize individuals to Turtle', () => {
      const ontology = createMockOntology()
      const individual = createMockIndividual('http://example.org/john', 'John')
      individual.types = ['http://example.org/Person']

      ontology.individuals.set(individual.id, individual)

      const result = serializeToTurtle(ontology)

      expect(result).toContain('<http://example.org/john> a <http://example.org/Person>')
      expect(result).toContain('rdfs:label "John"')
    })

    it('should handle multiple types for individuals', () => {
      const ontology = createMockOntology()
      const individual = createMockIndividual('http://example.org/john', 'John')
      individual.types = ['http://example.org/Person', 'http://example.org/Student']

      ontology.individuals.set(individual.id, individual)

      const result = serializeToTurtle(ontology)

      expect(result).toContain('<http://example.org/Person>, <http://example.org/Student>')
    })

    it('should handle classes without labels or descriptions', () => {
      const ontology = createMockOntology()
      const testClass = createMockClass('http://example.org/Thing', 'Thing')
      testClass.label = undefined
      testClass.description = undefined

      ontology.classes.set(testClass.id, testClass)

      const result = serializeToTurtle(ontology)

      expect(result).toContain('<http://example.org/Thing> a owl:Class')
      expect(result).not.toContain('rdfs:label')
      expect(result).not.toContain('rdfs:comment')
    })
  })

  describe('Integration tests', () => {
    it('should serialize complex ontology to all formats', () => {
      const ontology = createMockOntology()

      // Add classes
      const personClass = createMockClass('http://example.org/Person', 'Person')
      const studentClass = createMockClass('http://example.org/Student', 'Student')
      studentClass.superClasses = ['http://example.org/Person']

      ontology.classes.set(personClass.id, personClass)
      ontology.classes.set(studentClass.id, studentClass)

      // Add properties
      const hasAge = createMockProperty('http://example.org/hasAge', 'hasAge')
      hasAge.type = 'DataProperty'
      hasAge.domain = ['http://example.org/Person']
      hasAge.range = ['http://www.w3.org/2001/XMLSchema#integer']

      ontology.properties.set(hasAge.id, hasAge)

      // Add individual
      const john = createMockIndividual('http://example.org/john', 'John')
      john.types = ['http://example.org/Student']

      ontology.individuals.set(john.id, john)

      // Test all serializers produce valid output
      const jsonld = serializeToJSONLD(ontology)
      expect(() => JSON.parse(jsonld)).not.toThrow()

      const turtle = serializeToTurtle(ontology)
      expect(turtle).toContain('@prefix')
      expect(turtle.length).toBeGreaterThan(100)
    })

    it('should preserve ontology structure through serialization', () => {
      const ontology = createMockOntology()
      ontology.version = '2.5.1'

      const classA = createMockClass('http://example.org/ClassA', 'ClassA')
      const classB = createMockClass('http://example.org/ClassB', 'ClassB')
      classB.superClasses = ['http://example.org/ClassA']
      classB.disjointWith = ['http://example.org/ClassC']

      ontology.classes.set(classA.id, classA)
      ontology.classes.set(classB.id, classB)

      const jsonld = JSON.parse(serializeToJSONLD(ontology))

      // Verify structure preserved
      expect(jsonld['owl:versionInfo']).toBe('2.5.1')
      expect(jsonld['@graph']).toHaveLength(2)

      const classAData = jsonld['@graph'].find((c: any) => c['@id'] === 'http://example.org/ClassA')
      const classBData = jsonld['@graph'].find((c: any) => c['@id'] === 'http://example.org/ClassB')

      expect(classAData).toBeDefined()
      expect(classBData).toBeDefined()
      expect(classBData['rdfs:subClassOf']).toEqual([{ '@id': 'http://example.org/ClassA' }])
      expect(classBData['owl:disjointWith']).toEqual([{ '@id': 'http://example.org/ClassC' }])
    })
  })

  describe('Edge cases', () => {
    it('should handle special characters in labels', () => {
      const ontology = createMockOntology()
      const testClass = createMockClass('http://example.org/Test', 'Test')
      testClass.label = 'Test "Class" with <special> & characters'

      ontology.classes.set(testClass.id, testClass)

      const turtle = serializeToTurtle(ontology)
      expect(turtle).toContain('Test "Class" with <special> & characters')
    })

    it('should handle empty arrays gracefully', () => {
      const ontology = createMockOntology()
      const testClass = createMockClass('http://example.org/Empty', 'Empty')
      testClass.superClasses = []
      testClass.disjointWith = []

      ontology.classes.set(testClass.id, testClass)

      const jsonld = JSON.parse(serializeToJSONLD(ontology))
      const classData = jsonld['@graph'][0]

      expect(classData['rdfs:subClassOf']).toEqual([])
      expect(classData['owl:disjointWith']).toEqual([])
    })

    it('should handle large ontologies', () => {
      const ontology = createMockOntology()

      // Add 100 classes
      for (let i = 0; i < 100; i++) {
        const cls = createMockClass(`http://example.org/Class${i}`, `Class${i}`)
        ontology.classes.set(cls.id, cls)
      }

      const jsonld = serializeToJSONLD(ontology)
      const parsed = JSON.parse(jsonld)

      expect(parsed['@graph']).toHaveLength(100)
    })
  })

  describe('serializeToOWLXML', () => {
    it('should serialize empty ontology to OWL/XML', () => {
      const ontology = createMockOntology()
      const result = serializeToOWLXML(ontology)

      expect(result).toContain('<?xml version="1.0"?>')
      expect(result).toContain('<rdf:RDF')
      expect(result).toContain('xmlns:owl="http://www.w3.org/2002/07/owl#"')
      expect(result).toContain('xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"')
      expect(result).toContain(`<owl:Ontology rdf:about="${ontology.id}">`)
    })

    it('should include version in OWL/XML', () => {
      const ontology = createMockOntology()
      ontology.version = '3.1.4'

      const result = serializeToOWLXML(ontology)

      expect(result).toContain('<owl:versionInfo>3.1.4</owl:versionInfo>')
    })

    it('should serialize classes to OWL/XML', () => {
      const ontology = createMockOntology()
      const testClass = createMockClass('http://example.org/Person', 'Person')
      ontology.classes.set(testClass.id, testClass)

      const result = serializeToOWLXML(ontology)

      expect(result).toContain('<owl:Class rdf:about="http://example.org/Person">')
      expect(result).toContain('<rdfs:label>Person</rdfs:label>')
      expect(result).toContain('<rdfs:comment>Description of Person</rdfs:comment>')
      expect(result).toContain('</owl:Class>')
    })

    it('should serialize class hierarchy to OWL/XML', () => {
      const ontology = createMockOntology()
      const personClass = createMockClass('http://example.org/Person', 'Person')
      const studentClass = createMockClass('http://example.org/Student', 'Student')
      studentClass.superClasses = ['http://example.org/Person']

      ontology.classes.set(personClass.id, personClass)
      ontology.classes.set(studentClass.id, studentClass)

      const result = serializeToOWLXML(ontology)

      expect(result).toContain('<owl:Class rdf:about="http://example.org/Student">')
      expect(result).toContain('<rdfs:subClassOf rdf:resource="http://example.org/Person"/>')
    })

    it('should serialize properties to OWL/XML', () => {
      const ontology = createMockOntology()
      const prop = createMockProperty('http://example.org/hasAge', 'hasAge')
      prop.type = 'DataProperty'
      prop.domain = ['http://example.org/Person']
      prop.range = ['http://www.w3.org/2001/XMLSchema#integer']

      ontology.properties.set(prop.id, prop)

      const result = serializeToOWLXML(ontology)

      expect(result).toContain('<owl:DataProperty rdf:about="http://example.org/hasAge">')
      expect(result).toContain('<rdfs:domain rdf:resource="http://example.org/Person"/>')
      expect(result).toContain('<rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#integer"/>')
      expect(result).toContain('</owl:DataProperty>')
    })

    it('should serialize individuals to OWL/XML', () => {
      const ontology = createMockOntology()
      const individual = createMockIndividual('http://example.org/john', 'John')
      individual.types = ['http://example.org/Person']

      ontology.individuals.set(individual.id, individual)

      const result = serializeToOWLXML(ontology)

      expect(result).toContain('<owl:NamedIndividual rdf:about="http://example.org/john">')
      expect(result).toContain('<rdf:type rdf:resource="http://example.org/Person"/>')
      expect(result).toContain('<rdfs:label>John</rdfs:label>')
      expect(result).toContain('</owl:NamedIndividual>')
    })

    it('should close the RDF/XML tag', () => {
      const ontology = createMockOntology()
      const result = serializeToOWLXML(ontology)

      expect(result).toContain('</rdf:RDF>')
      expect(result.trim().endsWith('</rdf:RDF>')).toBe(true)
    })
  })
})
