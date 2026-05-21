const request = require('supertest');

test ('', () => {
    //https://swapi.dev/api
    // /people/1

    const resposta = request('https://swapi.dev/api').get('/people/1');

    console.log(resposta.body)
});