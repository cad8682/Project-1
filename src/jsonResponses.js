const { randomInt } = require('node:crypto');
const fs = require('node:fs');

const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);
    response.writeHead(status, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
  
    if (request.method !== 'HEAD' && status !== 204) {
      response.write(content);
    }
    
    response.end();
  };

//searches the Pokedex by checking what mons fit the given parameters. If no parameters given, whole dex
const searchPokedex = (request, response) => {
    let data;
    try {
        data = fs.readFileSync('./data/pokedex.json', 'utf8');
        data = JSON.parse(data);
    } catch (err) {
        console.error(err);
        const responseData = {
            message: 'Server Error When Reading Dataset',
            id: 'Id: internalError'
        };
        respondJSON(request, response, 500, responseData);
        return;
    }

    // filter by name
    if (request.query.name) {
        data = data.filter(pokeman => {
            return pokeman.name.toLowerCase() === request.query.name.toLowerCase();
        });
    }
    // filter by number
    //Not working
    if (request.query.number) {
        data = data.filter(pokeman => {
            return pokeman.id === Number(request.query.number);
        });
    }
    // filter by type one
    if (request.query.type1) {
        data = data.filter(pokeman => {
            return pokeman.type[0].toLowerCase() === request.query.type1.toLowerCase();
        });
    }
    // filter by type two
    if (request.query.type2) {
        data = data.filter(pokeman => {
            if (pokeman.type.length > 1) {
                return pokeman.type[1].toLowerCase() === request.query.type2.toLowerCase();
            }
        });
    }
    // filter by minimum weight The JSON has kgs and ms attached to the heights and weights
    if (request.query.weightMin) {
        data = data.filter(pokeman => {
            return parseFloat(pokeman.weight) >= Number(request.query.weightMin);
        });
    }
    // filter by maximum weight
    if (request.query.weightMax) {
        data = data.filter(pokeman => {
            return parseFloat(pokeman.weight) <= Number(request.query.weightMax);
        });
    }
    // filter by minimum height
    if (request.query.heightMin) {
        data = data.filter(pokeman => {
            return parseFloat(pokeman.height) >= Number(request.query.heightMin);
        });
    }
    // filter by maximum height
    if (request.query.heightMax) {
        data = data.filter(pokeman => {
            return parseFloat(pokeman.height) <= Number(request.query.heightMax);
        });
    }
    // filter by given weakness
    if (request.query.weakness) {
        data = data.filter(pokeman => {
            return pokeman.weaknesses.find(weakness => {
                 return request.query.weakness.toLowerCase() === weakness.toLowerCase();
            } ) !== undefined;
        });
    }

    //Fix handlePost, use RespondJSON
    respondJSON(request, response, 200, data);
};

//gets all Pokemon of the user's given type
const getTypes = (request, response) => {
    let data;
    try {
        data = fs.readFileSync('./data/pokedex.json', 'utf8');
        data = JSON.parse(data);
    } catch (err) {
        console.error(err);
        const responseData = {
            message: 'Server Error When Reading Dataset',
            id: 'Id: internalError'
        };
        respondJSON(request, response, 500, responseData);
        return;
    }

    if (request.query.type1 || request.query.type2) {
        // filter by type one
        if (request.query.type1) {
            data = data.filter(pokeman => {
                return pokeman.type[0].toLowerCase() === request.query.type1.toLowerCase();
            });
        }
        // filter by type two
        if (request.query.type2) {
            data = data.filter(pokeman => {
                if (pokeman.type.length > 1) {
                    return pokeman.type[1].toLowerCase() === request.query.type2.toLowerCase();
                }
            });
        }

        respondJSON(request, response, 200, data);
    }
    else {
        const responseData = {
            message: 'Error: Please input a primary and or secondary type',
            id: 'Id: badRequest'
        };
        respondJSON(request, response, 400, responseData);
        return;
    }
};

//adds a Pokemon, needs every parameter filled, else give status 400
const addPokemon = (request, response) => {
    let newPokemon;
    const responseJSON = {
      message: 'All fields are required (except Type 2).',
    };
    debugger
    const { name, number, type1, type2, weightMin, weightMax, heightMin, heightMax, weakness } = request.body;
    console.log(request.body);
    if (!name || !number || !type1 || !weightMin || !weightMax || !heightMin || !heightMax || !weakness) {
      responseJSON.id = 'missingParams';
      return respondJSON(request, response, 400, responseJSON);
    }
    newPokemon = request.body;
    let data;
    try {
        data = fs.readFileSync('./data/pokedex.json', 'utf8');
        data = JSON.parse(data);
    } catch (err) {
        console.error(err);
        const responseData = {
            message: 'Server Error When Reading Dataset',
            id: 'Id: internalError'
        };
        respondJSON(request, response, 500, responseData);
        return;
    }

    let responseCode = 204;
  
    if (!newPokemon[name]) {
      responseCode = 201;
      newPokemon[name] = {
        name: name,
      };
    }
    
    newPokemon[name].number = number;
    newPokemon[name].typeOne = type1;
    newPokemon[name].typeTwo = type2;
    newPokemon[name].weightMin = weightMin;
    newPokemon[name].weightMax = weightMax;
    newPokemon[name].heightMin = heightMin;
    newPokemon[name].heightMax = heightMax;
    newPokemon[name].weakness = weakness;
  
    data.push(newPokemon);

    try {
        fs.writeFileSync('./data/pokedex.json', JSON.stringify(data), 'utf8');
    } catch (err) {
        console.error(err);
        const responseData = {
            message: 'Server Error When Writing Dataset',
            id: 'Id: internalError'
        };
        respondJSON(request, response, 500, responseData);
        return;
    }

    if (responseCode === 201) {
      responseJSON.message = 'Created Successfully';
      responseJSON.newMon = newPokemon[name];
      return respondJSON(request, response, responseCode, responseJSON);
    }
    return respondJSON(request, response, responseCode, {});
};

//Takes a user given number and generates that many random Pokemon
const getRandom = (request, response) => {
    let data;
    try {
        data = fs.readFileSync('./data/pokedex.json', 'utf8');
        data = JSON.parse(data);
    } catch (err) {
        console.error(err);
        const responseData = {
            message: 'Server Error When Reading Dataset',
            id: 'Id: internalError'
        };
        respondJSON(request, response, 500, responseData);
        return;
    }

    // using the number given, generate that many random Pokemon
    if (request.query.number > 0) {
        let generatedPokemon = [];
        let randNum;
        for (let i = 0; i < request.query.number; i++) {
            randNum = Math.floor((Math.random() * data.length));

            while (generatedPokemon.includes(randNum)) {
                randNum = Math.floor((Math.random() * data.length));
            }

            generatedPokemon.push(randNum);
        }

        //Replace all the numbers with the mons
        for (let i = 0; i < generatedPokemon.length; i++) {
            generatedPokemon[i] = data[generatedPokemon[i]];
            //console.log(generatedPokemon[i]);
        }

        respondJSON(request, response, 200, generatedPokemon);
    }
    else {
        const responseData = {
            message: 'Error: Need a positive number in the number field',
            id: 'Id: badRequest'
        };
        respondJSON(request, response, 400, responseData);
        return;
    }
};

const notFound = (request, response) => {
    const responseData = {
        message: 'Message: The page you were looking for cannot be found',
        id: 'Id: notFound'
      };
        respondJSON(request, response, 404, responseData);
};

module.exports = {
    searchPokedex,
    getTypes,
    getRandom,
    addPokemon,
    notFound
};