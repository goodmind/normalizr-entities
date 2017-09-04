// TODO: better types
function selectEntities<T>(input: any, schema: Schema, entities: T): { [P in keyof T]: (string | number)[] }

export default selectEntities