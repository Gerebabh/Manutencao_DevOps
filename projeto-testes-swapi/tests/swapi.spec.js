const request = require( 'supertest' );

// Personagem por ID: 1 Luke, 2 C3PO, 3 R2D2, 4 Vader...
const personagemNumber = 3;

test (`Deve visualizar informações do personagem por ID ${personagemNumber}`, async () => {
    //https://swapi.dev/api Não está funcionando - Certificado expirado.
    //https://swapi.info/api funcional

    const resposta = await request('https://swapi.info/api').get(`/people/${personagemNumber}`);
    // verifica se o status da requisição está retornando verdadeira com status 200
    expect(resposta.status).toBe(200);
    // verificando a garantia se essas informações existem, não sendo indefinida
    expect(resposta.body.films).toBeDefined();
    // verificando se recupera o corpo do conteúdo, um ou mais veículos (aeronaves)
    const nomePersonagem = resposta.body.name
    expect(resposta.body.name).toBe(nomePersonagem);
    const urlCompletaPlaneta = resposta.body.homeworld;
    const rotaPlaneta = urlCompletaPlaneta.replace('https://swapi.info/api','');
    const respostaPlaneta = await request('https://swapi.info/api').get(rotaPlaneta);
    expect(respostaPlaneta.status).toBe(200);
    const nomePlaneta = respostaPlaneta.body.name;
    expect(respostaPlaneta.body.name).toBe(nomePlaneta);

    console.log("O pesonagem é", nomePersonagem, "e seu planeta natal é", nomePlaneta);
});

// Saber quantos personagens estão cadastrados na API
test('', async () => {
    const resposta = await request ('https://swapi.info/api').get('/people');
    const personagens = resposta.body.length;
    console.log("São", personagens, "personagens cadastrados.")
});

test('Deve receber uma mensagem de erro, quando buscar um personagem inexistente',
    async () => {
        const resposta = await request('https://swapi.info/api').get('/people/999');
        //verifica se o status da requisição está retornando falso com status 404
        expect(resposta.status).toBe(404);
        //verifica o valor do corpo vazio não encontrado
        expect(resposta.body).toEqual({});
        //podemos verificar também o corpo vazio do objeto
        expect(resposta.body.detail).toBeUndefined();
    });

// ===============================
// EXERCÍCIOS DE TREINO (ITEM 16)
// ===============================

// --- CENÁRIOS DE PLANETAS (PLANETS) ---
const planetaNumber = 1

test(`1. Deve visualizar informações do planeta ID ${planetaNumber}`, async () => {
    const resposta = await request('https://swapi.info/api').get(`/planets/${planetaNumber}`);
    expect(resposta.status).toBe(200);
    const planetName = resposta.body.name;
    expect(resposta.body.name).toBe(`${planetName}`);
    expect(resposta.body.terrain).toBeDefined();
    console.log("O planeta é:", resposta.body.name)
});

test('2. Deve verificar se as informações de clima de Tatooine existem', async () => {
    const resposta = await request('https://swapi.info/api').get(`/planets/${planetaNumber}`);
    expect(resposta.status).toBe(200);
    const climate = resposta.body.climate
    expect(resposta.body.climate).toBe(climate);
    console.log("O clima em", resposta.body.name, "é: ", resposta.body.climate);
});

test('3. Deve retornar erro 404 ao buscar um planeta que não existe (ID 999)', async () => {
    const resposta = await request('https://swapi.info/api').get('/planets/999');
    expect(resposta.status).toBe(404);
    expect(resposta.body).toEqual({}); 
});

// --- NAVES

const naveNumber = 13;  // Use 3, 9, 10, 12, 13

test(`4. Deve visualizar informações da nave ID 10 ${naveNumber}`, async () => {
    const resposta = await request('https://swapi.info/api').get(`/starships/${naveNumber}`);
    expect(resposta.status).toBe(200);
    const nave = resposta.body.name;
    expect(resposta.body.name).toBe(nave);
    console.log("A nave é", nave);
});

test(`5. Deve verificar se a nave ID ${naveNumber} possui pilotos e listar seus nomes`, async () => {
    const resposta = await request('https://swapi.info/api').get(`/starships/${naveNumber}`);
    expect(resposta.status).toBe(200);
    expect(resposta.body.pilots).toBeDefined();

    const listaUrlsPilotos = resposta.body.pilots;

    if (listaUrlsPilotos.length > 0) {
        console.log(`A nave ID ${naveNumber} tem ${listaUrlsPilotos.length} piloto(s). Buscando nomes...`);

        const nomesDosPilotos = [];

        for (const urlCompletaPiloto of listaUrlsPilotos) {
            const rotaPiloto = urlCompletaPiloto.replace('https://swapi.info/api', '');
            const respostaPiloto = await request('https://swapi.info/api').get(rotaPiloto);
            expect(respostaPiloto.status).toBe(200);
            nomesDosPilotos.push(respostaPiloto.body.name);
        }
        console.log("Piloto(s) da nave:", nomesDosPilotos.join(', '));

    } else {
        console.log(`A nave ID ${naveNumber} é automatizada ou não tem pilotos cadastrados.`);
        expect(listaUrlsPilotos.length).toBe(0);
    }
});

test('6. Deve retornar erro 404 ao buscar uma nave que não existe (ID 999)', async () => {
    const resposta = await request('https://swapi.info/api').get('/starships/999');
    expect(resposta.status).toBe(404);
    expect(resposta.body).toEqual({});
});


// --- CENÁRIOS DE FILMES (FILMS) ---

test('7. Deve visualizar informações do primeiro filme lançado (A New Hope - ID 1)', async () => {
    const resposta = await request('https://swapi.info/api').get('/films/1');
    expect(resposta.status).toBe(200);
    expect(resposta.body.title).toBe('A New Hope');
});

test('8. Deve verificar se o primeiro filme possui uma lista de personagens cadastrados', async () => {
    const resposta = await request('https://swapi.info/api').get('/films/1');
    expect(resposta.status).toBe(200);
    expect(resposta.body.characters).toBeDefined();
    expect(resposta.body.characters.length).toBeGreaterThan(0);
});


// --- Rotas que não existem ---

test('9. Deve retornar erro 404 ao buscar uma rota que nunca existiu (Ex: /heroes)', async () => {
    const resposta = await request('https://swapi.info/api').get('/heroes');
    expect(resposta.status).toBe(404);
    expect(resposta.body).toEqual({});
});

test('10. Deve retornar erro 404 ao passar um texto no lugar do ID do personagem', async () => {
    const resposta = await request('https://swapi.info/api').get('/people/abc');
    expect(resposta.status).toBe(404);
    expect(resposta.body).toEqual({});
});