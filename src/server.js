const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//searchPokedex, getType, getShiny, getCostumes, addPokemon, removePokemon (by id, not name), getMegas? getGigantamax? getRandom

const handlePost = async (request, response, parsedUrl) => {
  const body = await parseBody(request);
  request.body = body;
  if (parsedUrl.pathname === '/addUser') {
    jsonHandler.addUser(request, response);
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    //htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getUsers') {
    //jsonHandler.getUsers(request, response);
  } else if (parsedUrl.pathname === '/') {
    //htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/addUser') {
    //jsonHandler.addUser(request, response);
  }
  else {
    jsonHandler.notFound(request, response);
  }
};

const handleHead = (request, respoinse, parsedUrl) => {
    //
};

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  
        if (request.method === 'GET') {
          handleGet(request, response, parsedUrl);
        }
        if (request.method === 'POST') {
          handlePost(request, response, parsedUrl);
        }
        if (request.method === 'HEAD') {
            handleHead(request, response, parsedUrl);
        }
        response.writeHead(200, { 
          'Content-Type': 'application/json', 
          //Something with the parsedURL here is weird, I don't remember what the right variable is
          //'Content-Length': Buffer.byteLength(parsedUrl, 'utf8'),
        });
  };
  
  http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
  });