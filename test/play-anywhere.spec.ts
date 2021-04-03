import { IPaServer } from '../src/declarations'
import pa from './../src/index'
import { get } from 'http'

describe('Pa init test', () => {
  let server: IPaServer | null = null
  beforeAll(async () => {
    server = await pa('test/demo', '-s')
  })

  afterAll(async () => {
    if (server != null) {
      await server.close()
      server = null
      console.log('Server is down.')
    } else {
      console.log('Server is not running.')
    }
  })

  it('should be Pa instance', done => {
    console.log('test')
    const req = get('http://localhost:3000', res => {
      res.on('data', (chunk: string) => {
        console.log(`响应主体: ${chunk}`)
      })
      res.on('end', () => {
        console.log('响应中已无数据')
        done()
      })
    })
    req.on('error', err => {
      console.log(err)
      done()
    })
  })
})
