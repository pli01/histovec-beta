import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { loggerStream } from './util/logger'
import routes from './routes'
import { config } from './config'

const app = express()

app.get(`${config.apiPrefix}/version`, function (req, res) {
  res.send(config.version)
})

const formatAsNginx =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time'

app.use(morgan(formatAsNginx, { stream: loggerStream }))
app.use(bodyParser.json({ limit: '2kb' }))
app.use(bodyParser.urlencoded({ limit: '2kb', extended: false }))

app.use(config.apiPrefix, routes)

export default app