/* global describe, it */

require('babel-polyfill');
require('should');
const request = require('superagent');

describe('api', () => {

    const host = 'http://localhost:3300';

    describe('animals', () => {

        let newId;
        const newAnimal = {
            name: 'bird',
            type: 'flyer'
        };

        describe('/GET animal', () => {
            it('should GET all the animals', async function() {
                const { statusCode, text } = await request
                    .get(`${host}/api/animal`);
                statusCode.should.equal(200);
                const data = JSON.parse(text);
                data.should.be.an.Array();
            });
        });

        describe('/POST animal', () => {
            it('should POST a new animal', async function() {
                const { statusCode, text } = await request
                    .post(`${host}/api/animal`)
                    .send(newAnimal);
                statusCode.should.equal(200);
                const parsedData = JSON.parse(text);
                parsedData.should.be.an.Object();
                parsedData.id.should.be.a.String();
                parsedData.name.should.equal(newAnimal.name);
                parsedData.type.should.equal(newAnimal.type);
                newId = parsedData.id;
            });
        });

        describe('/GET/:id animal', () => {
            it('should GET an animal by the given id', async function() {
                const { statusCode, text } = await request
                    .get(`${host}/api/animal/${newId}`);
                statusCode.should.equal(200);
                const parsedData = JSON.parse(text);
                parsedData.should.be.an.Object();
                parsedData.id.should.equal(newId);
                parsedData.name.should.equal(newAnimal.name);
                parsedData.type.should.equal(newAnimal.type);
            });
        });

        describe('/POST/:id animal', () => {
            it('should POST an updated animal by the given id', async function() {
                const { statusCode, text } = await request
                    .post(`${host}/api/animal/${newId}`)
                    .send({
                        name: 'eagle'
                    });
                statusCode.should.equal(200);
                const parsedData = JSON.parse(text);
                parsedData.should.be.an.Object();
                parsedData.id.should.equal(newId);
                parsedData.name.should.equal('eagle');
                parsedData.type.should.equal(newAnimal.type);
            });
        });

        describe('/DELETE/:id animal', () => {
            it('should DELETE an animal by the given id', async function() {
                const { statusCode } = await request
                    .delete(`${host}/api/animal/${newId}`);
                statusCode.should.equal(200);
            });
        });

    });

});
