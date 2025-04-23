const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);
    handler(request, response);
  });
};

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addPokemon') {
    parseBody(request, response, jsonHandler.addPokemon(request, response));
  }
};

const handleGet = (request, response, parsedUrl) => {
  console.log(parsedUrl.pathname);
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/searchPokedex') {
    jsonHandler.searchPokedex(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/getTypes') {
    jsonHandler.getTypes(request, response);
  } else if (parsedUrl.pathname === '/getRandom') {
    jsonHandler.getRandom(request, response);
  }
  else {
    jsonHandler.notFound(request, response);
  }
};

//const handleHead = (request, respoinse, parsedUrl) => {
    //
//};

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
    request.query = Object.fromEntries(parsedUrl.searchParams);

        if (request.method === 'GET' || request.method === 'HEAD') {
          handleGet(request, response, parsedUrl);
        }
        if (request.method === 'POST') {
          handlePost(request, response, parsedUrl);
        }
        //if (request.method === 'HEAD') {
            //handleHead(request, response, parsedUrl);
        //}
  };
  
  http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
  });