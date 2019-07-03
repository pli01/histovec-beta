import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { loggerStream } from './util/logger'
import routes from './routes'
import config from './config'
import { decryptXOR } from './util/crypto'

const app = express()

morgan.token('id', function (req) {
  return req.body.id
})

morgan.token('uuid', function (req) {
  return req.body.uuid
})

morgan.token('utacId', function (req) {
  return req.body.utacId
})

const formatAsNginx =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time :id'

function formatAsJson(tokens, req, res) {
  return JSON.stringify({
    'remote-address': tokens['remote-addr'](req, res),
    'remote-user': tokens['remote-user'](req, res),
    'timestamp': tokens['date'](req, res, 'iso'),
    'response-time': tokens['response-time'](req, res, 'iso'),
    'method': tokens['method'](req, res),
    'url': tokens['url'](req, res),
    'http-version': tokens['http-version'](req, res),
    'status-code': tokens['status'](req, res),
    'content-length': tokens['res'](req, res, 'content-length'),
    'referrer': tokens['referrer'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    'id': tokens['id'](req, res),
    'uuid': tokens['uuid'](req, res),
    'utacId': tokens['utacId'](req, res)
  })
}

app.use(morgan(formatAsJson, { stream: loggerStream }))
app.use(bodyParser.json({ limit: '2kb' }))
app.use(bodyParser.urlencoded({ limit: '2kb', extended: false }))

app.use(config.apiPrefix, routes)

export default app
