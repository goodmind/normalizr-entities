import selectEntities from '../'
import { normalize, schema } from 'normalizr'

it('gets nested entities', () => {
  const entitySettings = {
    idAttribute: (v) => +v.id,
  }
  const user = new schema.Entity('users', {}, entitySettings)
  const comment = new schema.Entity('comments', {
    user: user
  })
  const article = new schema.Entity('articles', {
    author: user,
    comments: new schema.Array(comment)
  }, entitySettings)
  const articles = new schema.Array(article)

  const input = [{
    id: '123',
    title: 'A Great Article',
    author: {
      id: '8472',
      name: 'Paul'
    },
    body: 'This article is great.',
    comments: [
      {
        id: 'comment-123-4738',
        comment: 'I like it!',
        user: {
          id: '10293',
          name: 'Jane'
        }
      }
    ]
  }, {
    id: '124',
    title: 'A Great Article',
    author: {
      id: '8473',
      name: 'Paul'
    },
    body: 'This article is great.',
    comments: [
      {
        id: 'comment-124-4739',
        comment: 'I don\'t like it!',
        user: {
          id: '10293',
          name: 'Jane'
        }
      }
    ]
  }]
  
  const data = normalize(input, articles)
  expect(selectEntities(data.entities.articles[123], article, data.entities)).toMatchSnapshot()
})

it('gets multiple entities', () => {
  const inferSchemaFn = jest.fn(input => input.type || 'dogs')
  const catSchema = new schema.Entity('cats')
  const peopleSchema = new schema.Entity('person')
  const listSchema = new schema.Array({
    cats: catSchema,
    people: peopleSchema
  }, inferSchemaFn)
  const wrapped = new schema.Object({ data: listSchema })

  const data = normalize({ data: [
    { type: 'cats', id: '123' },
    { type: 'people', id: '123' },
    { id: '789', name: 'fido' },
    { type: 'cats', id: '456' }
  ]}, wrapped)

  expect(selectEntities(data.result, wrapped, data.entities)).toMatchSnapshot()
  expect(inferSchemaFn.mock.calls).toMatchSnapshot()
})