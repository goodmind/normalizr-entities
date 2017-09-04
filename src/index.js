// @flow

import { type Schema } from 'normalizr'
import EntitySchema from 'normalizr/dist/src/schemas/Entity'
import ArraySchema, * as ArrayUtils from 'normalizr/dist/src/schemas/Array'
import ObjectSchema, * as ObjectUtils from 'normalizr/dist/src/schemas/Object'
import * as ImmutableUtils from 'normalizr/dist/src/schemas/ImmutableUtils'

function unvisitKeys(input, schema, unvisit) {
  for (const [key, value] of Object.entries(schema.schema)) {
    unvisit(input[key], schema.schema[key])
  }
}

const getUnvisit = (acc = {}, entities) => {
  const getEntity = getEntities(entities);

  function unvisit(input, schema) {
    if (schema instanceof EntitySchema) {
      const entity = getEntity(input, schema);
      acc[schema.key] = [schema.getId(entity) || input]
      const entityCopy = ImmutableUtils.isImmutable(entity) ? entity : Object.assign({}, entity);
      schema.denormalize(entityCopy, unvisit)
    } else if (typeof schema.denormalize === 'function') {
      schema.denormalize(input, unvisit)
    } else {
      throw new Error('Unknown type')
    }

    return acc
  }

  return unvisit
}

const getEntities = (entities) => {
  const isImmutable = ImmutableUtils.isImmutable(entities)

  return (entityOrId, schema) => {
    const schemaKey = schema.key

    if (typeof entityOrId === 'object') {
      return entityOrId
    }

    return isImmutable ?
      entities.getIn([ schemaKey, entityOrId.toString() ]) :
      entities[schemaKey][entityOrId]
  }
}

function selectEntities(input: any, schema: Schema, entities: any) {
  if (!input) {
    return input
  }

  return getUnvisit({}, entities)(input, schema);
}

export default selectEntities