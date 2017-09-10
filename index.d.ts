// TODO: better types
import { Schema } from 'normalizr'
declare function selectEntities<T, K extends string | number>(input: any, schema: Schema, entities: T): { [P in keyof T]: K[] }

export default selectEntities