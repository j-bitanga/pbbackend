const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-1234",
    },

    {
        id: 2,
        name: "John Stamos",
        number: "454-3241",
    },
    {
        id: 3,
        name: "Rev Boder",
        number: "977-3132",
    },

    
  ]


app.get('/api/persons', (request, response) => {  /* returns entire list of persons */
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => { /* takes in requested id and responds with information under that id */
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => { /*  */
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


app.get('/info', (request, response) => { /* returns time of action and number of items in persons list */
    numPersons = persons.length
    date = Date()
    response.send(`${date} Phonebook has information for: ${numPersons} people`)
})

const generateId = () => {
    const maxId = persons.length > 0 ? Math.floor(Math.random() * Math.floor(100)) : 0

        return maxId
}
app.post('/api/persons' , (request, response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({
            error:'name is empty'
        })
    }

    if(!body.number) {
        return response.status(400).json({
            error:'number is empty'
        })
    }

    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error:'Person exists'
        })
    }


    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    console.log(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error:'Unknown endpoint'})
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
