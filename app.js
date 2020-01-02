const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const tokenExtractor = require('./utils/token_extractor')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const errorHandler = require('./utils/error_handler')
const mongoose = require('mongoose')

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(errorHandler)

module.exports = app