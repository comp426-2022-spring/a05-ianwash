// Place your server entry point code here
var minimist = require('minimist');
const { exit } = require('process');

var args = minimist(process.argv.slice(2), {
    integer: [ 'port' ],
    boolean: [ 'debug', 'log', 'help' ],
    default: { help: false, port: 5555, debug: false, log: true },
    '--': true,
  })

  args['port', 'debug', 'log', 'help'];

  const help = (`
  server.js [options]

  --por		Set the port number for the server to listen on. Must be an integer
                between 1 and 65535.

  --debug	If set to true, creates endlpoints /app/log/access/ which returns
                a JSON access log from the database and /app/error which throws 
                an error with the message "Error test successful." Defaults to 
    false.

  --log		If set to false, no log files are written. Defaults to true.
    Logs are always written to database.

  --help	Return this message and exit.
  `);
  if (args.help || args.h) {
      console.log(help);
      process.exit(0);
  }


const express = require('express');
const app = express();
const logdb = require("./database.js");
const fs = require('fs');
const morgan = require('morgan');

const port = args.port || 5555;
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
})

if (args.log) {
  const write = fs.createWriteStream('access.log', { flags: 'a' })
  // Set up the access logging middleware
  app.use(morgan('combined', { stream: write }))
}


app.use((req, res, next) => {
    let data = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    const stmt = logdb.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(data.remoteaddr, data.remoteuser, data.time, data.method, data.url, data.protocol, data.httpversion, data.status, data.referer, data.useragent);
    // res.status(200).json(info);
    next();
});

app.get('/app/', (req, res) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
  res.end(res.statusCode+ ' ' +res.statusMessage)
});

/** Coin flip functions 
 * This module will emulate a coin flip given various conditions as parameters as defined below
 */

/** Simple coin flip
 * 
 * Write a function that accepts no parameters but returns either heads or tails at random.
 * 
 * @param {*}
 * @returns {string} 
 * 
 * example: coinFlip()
 * returns: heads
 * 
 */

 function coinFlip() {
  let num = Math.random();
  
  if (num < 0.5) {
    return "heads";
  } else {
    return "tails";
  }
}

/** Multiple coin flips
 * 
 * Write a function that accepts one parameter (number of flips) and returns an array of 
 * resulting "heads" or "tails".
 * 
 * @param {number} flips 
 * @returns {string[]} results
 * 
 * example: coinFlips(10)
 * returns:
 *  [
      'heads', 'heads',
      'heads', 'tails',
      'heads', 'tails',
      'tails', 'heads',
      'tails', 'heads'
    ]
 */

function coinFlips(flips) {
  let vals = new Array(flips);
  for (let i = 0; i < flips; i++) {
    vals[i] = coinFlip();
  }
  return vals;
}

/** Count multiple flips
 * 
 * Write a function that accepts an array consisting of "heads" or "tails" 
 * (e.g. the results of your `coinFlips()` function) and counts each, returning 
 * an object containing the number of each.
 * 
 * example: conutFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
 * { tails: 5, heads: 5 }
 * 
 * @param {string[]} array 
 * @returns {{ heads: number, tails: number }}
 */

function countFlips(array) {
  const flips = {
    heads: 0,
    tails: 0,
  };

  const flip = Object.create(flips);

  for (let i = 0; i < array.length; i++) {
    if (array[i] === "heads") {
      flip.heads++;
    } else {
      flip.tails++;
    }
  }

  if (flip.heads === 0) {
    delete flip.heads;
  }

  if (flip.tails === 0) {
    delete flip.tails;
  }

  return flip;
}

/** Flip a coin!
 * 
 * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
 * 
 * @param {string} call 
 * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
 * 
 * example: flipACoin('tails')
 * returns: { call: 'tails', flip: 'heads', result: 'lose' }
 */

function flipACoin(call) {
  const flips = {
    call: "",
    flip: "",
    result: "",
  };

  const flip = Object.create(flips);

  flip.call = call;
  flip.flip = coinFlip();
  
  if (flip.call === flip.flip) {
    flip.result = "win";
  } else {
    flip.result = "lose";
  }

  return flip;
}

if (args.debug) {
  app.get('/app/log/access', (req, res) => {
    try {
      const stmt = logdb.prepare('SELECT * FROM accesslog').all()
      res.status(200).json(stmt)
    } catch (e) {
      console.error(e);
    }
  });
  app.get('/app/error', (req, res) => {
      throw new Error('Error test successful.');
  });
}

app.get('/app/flip/', (req, res) => {
  res.status(200).json({ "flip" : coinFlip() })
});

app.get('/app/flips/:number', (req, res) => {
  let flips = coinFlips(req.params.number);
    res.status(200).json({ "raw" : flips, "summary" : countFlips(flips)})
});

app.get('/app/flip/call/:bet', (req, res) => {
  let flip = flipACoin(req.params.bet);
  res.status(200).json({ "call" : flip.call, "flip" : flip.flip, "result" : flip.result})
});

app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});