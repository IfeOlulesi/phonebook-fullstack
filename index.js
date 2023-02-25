const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

const personsApi = require('./phonebook')


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body),
  ].join(' ')
}))


// app routes
app.get('/', (req, res) => res.redirect('/info'))

app.get('/info', (req, res) => personsApi.contactInfo(req, res))

app.get('/api/persons', (req, res) => personsApi.getAllContacts(req, res))

app.post('/api/persons', (req, res) => personsApi.addContact(req, res))

app.get('/api/persons/:id', (req, res) => personsApi.getContactById(req, res))

app.delete('/api/persons/:id', (req, res) => personsApi.deleteContact(req, res))


app.use(unknownEndpoint)


const PORT = process.env.port || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
