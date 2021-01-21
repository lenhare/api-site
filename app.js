const express = require('express')
const server = express()
const router = express.Router()
const port = 3000
const fs = require('fs')

server.use(express.json({extended: true}))

const readFile = () =>{
    const content = fs.readFileSync('./clientes.json', 'utf-8')
    return JSON.parse(content)
}

const writeFile = (content) =>{
    const updateFile = JSON.stringify(content)
     fs.writeFileSync('./clientes.json', updateFile, 'utf-8')
}

router.get('/', (req, res) => {
    const content = readFile()
    res.send(content)
})

router.post('/', (req, res) => {
    const { nome, email, telefone } = req.body
    const currentContent = readFile()
    const id = Math.random().toString(32).substr(2,9)
    currentContent.push({ id, nome, email, telefone })
    writeFile(currentContent)
    res.send({ id, nome, email, telefone } )
})

router.put('/:id', (req, res) => {
    const {id} = req.params
    const { nome, email, telefone } = req.body
    const currentContent = readFile()
    const selectedItem = currentContent.findIndex((item) => item.id === id)
    const { id: cId, nome:cNome, email:cEmail, telefone:cTelefone } = currentContent[selectedItem]
    const newObject = {
        id: cId,
        nome: nome ? nome: cNome,
        email: email? email: cEmail,
        telefone: telefone? telefone: cTelefone
    }
    currentContent[selectedItem] = newObject
    writeFile(currentContent)
    res.send(newObject)
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    const currentContent = readFile()
    const selectedItem = currentContent.findIndex((item) => item.id === id)
    currentContent.splice(selectedItem, 1)
    writeFile(currentContent)
    res.send(true)
})

server.use(router)

server.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`)
})