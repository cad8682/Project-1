//searches the Pokedex by checking what mons fit the given parameters. If no parameters given, whole dex
const searchPokedex = (request, response) => {
    //
};

//gets all Pokemon of the user's given type
const getType = (request, response) => {
    //
};

//gets the shiny of a user given name or id
const getShiny = (request, response) => {
    //
};

//gets all the costume images. If no parameters, every?
const getCostumes = (request, response) => {
    //
};

//adds a Pokemon, needs every parameter filled, else give status 400
const addPokemon = (request, response) => {
    //
};

//removes a given ID's Pokemon from the dex
const removePokemon = (request, response) => {
    //
};

//DO I KEEP? searches for a mega evolution of a user given name, returns the image
const getMegas = (request, response) => {
    //
};

//DO I KEEP? the megas function but with the gigantamax value (How should I combine them into 1)
const getGigantamax = (request, response) => {
    //
};

//Takes a user given number and generates that many random Pokemon
const getRandom = (request, response) => {
    //
};

const notFound = (request, response) => {
    const body = {
      error: 'That content wasn\'t found'
    }
    const content = JSON.stringify(body);
  
    response.writeHead(404, { 
      'Content-Type': 'application/json', 
      'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
  
    response.write(body);
  
    response.end();
};

module.exports = {
    searchPokedex,
    getType,
    getShiny,
    getCostumes,
    getMegas,
    getGigantamax,
    getRandom,
    addPokemon,
    removePokemon,
    notFound
};