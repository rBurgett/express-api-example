const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

let animals = [
    {id: '12345', name: 'tiger', type: 'cat'},
    {id: '23456', name: 'elephant', type: 'big'},
    {id: '34567', name: 'dog', type: 'dog'},
    {id: '45678', name: 'fish', type: 'water'},
    {id: '56789', name: 'spider', type: 'death'}
];

const handleError = err => console.error(err);

const server = express()
    .use(bodyParser.json())
    // .get('/', (req, res) => {
    //     res.send('home');
    // })
    .get('/api/animal', (req, res) => {
        try {
            res.send(JSON.stringify(animals));
        } catch(err) {
            handleError(err);
            res.sendStatus(500);
        }
    })
    .post('/api/animal', (req, res) => {
        try {
            const { body } = req;
            const id = uuid.v4();
            const newAnimal = Object
                .assign({}, body, {
                    id
                });
            animals = [
                ...animals,
                newAnimal
            ];
            res.send(JSON.stringify(newAnimal));
        } catch(err) {
            handleError(err);
            res.sendStatus(500);
        }
    })
    .get('/api/animal/:id', (req, res) => {
        try {
            const { id } = req.params;
            const animal = animals
                .find(a => a.id === id);
            if(animal) {
                res.send(JSON.stringify(animal));
            } else {
                res.sendStatus(404);
            }
        } catch(err) {
            handleError(err);
            res.sendStatus(500);
        }
    })
    .post('/api/animal/:id', (req, res) => {
        try {
            const { id } = req.params;
            const { body } = req;
            const idx = animals
                .findIndex(a => a.id === id);
            if(idx > -1) {
                const newAnimal = Object
                    .assign({}, animals[idx], body);
                animals = [
                    ...animals.slice(0, idx),
                    newAnimal,
                    ...animals.slice(idx + 1)
                ];
                res.send(JSON.stringify(newAnimal));
            } else {
                res.sendStatus(400);
            }
        } catch(err) {
            handleError(err);
            res.sendStatus(500);
        }
    })
    .delete('/api/animal/:id', (req, res) => {
        try {
            const { id } = req.params;
            const idx = animals
                .findIndex(a => a.id === id);
            if(idx > -1) {
                animals = [
                    ...animals.slice(0, idx),
                    ...animals.slice(idx + 1)
                ];
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }

        } catch(err) {
            handleError(err);
            res.sendStatus(500);
        }
    })
    .use(express.static('public'));

const port = 3300;
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
