import pkg from 'telegraf';
const {Telegraf } = pkg;
import { Snowflake } from "@theinternetfolks/snowflake";
import http from "http";
import handleText from './utils/handleText.js'
import createUser from './utils/createUser.js'
import client from './lib/sqlClient.js'
import fs from 'fs'
import path from 'path';
const __dirname = path.resolve();
import 'dotenv/config'

import Fastify from 'fastify'
import fastifyStatic from "@fastify/static";

const fastify = Fastify({
  logger: false
})

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "static"),
  prefix: "/static/", // optional: default '/'
  //constraints: { host: "example.com" }, // optional: default {}
});

// Declare a route
fastify.get('/', async (request, reply) => {
  console.log(request.url)
  reply.sendFile('index.html');
})

fastify.get('/:userId/:key', async (request, reply) => {
  console.log(request.params)

  try{
    const result = await client.execute(`select * from content where user_id = ${request.params.userId} and key = ${request.params.key} order by timestamp desc`) 

    return result.rows[0]
    
  }

  catch(e){
    return "invalid input"
  }
  
})

fastify.get('/:userId/:key/all', async (request, reply) => {
  console.log(request.params)
  const rest = await client.execute(`select * from content where user_id = ${request.params.userId} and key = ${request.params.key} order by timestamp desc`) 
  // array of objects with {value: value, timestamp: timestamp}
})

// Run the server!
try {
  await fastify.listen({ port: 8000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

const host = '0.0.0.0';
const port = 8000; 
const bot = new Telegraf(process.env.BOT_TOKEN)
const invalid ='Invalid input'

const requestListener = async function (req, res) {
  const url = req.url
  console.log(url)
  let urlList = url.split('/').slice(1)
  console.log(urlList)

  if(urlList[0] == ''){
    serveHomePage(res)
    return 
  }
  
  else if(urlList.length == 2){
    try {
        const result = await client.execute(`select * from content where user_id = ${urlList[0]} and key = ${urlList[1]} order by timestamp desc`)
        
        if (result.rows.length > 0) {
            res.writeHead(200);
            res.end(result.rows[0].value)
        }

        else {
            res.writeHead(404)
            res.end(invalid)
        }

    }

    catch(e) {
        res.writeHead(404);
        res.end(invalid)
    }
  }

  else {
      res.writeHead(404);
      res.end(invalid);
  }

}

// const server = http.createServer(requestListener);
// server.listen(port, host, () => {
//     console.log(`Server is running on http://${host}:${port}`);
// });


// try {    
//     const rs = await client.execute(`CREATE TABLE users (
//      id TEXT PRIMARY KEY,
//     user_id INTEGER UNIQUE,
//   created_at INTEGER,
//     username TEXT
//  );`)
//     // console.log(rs)
// } catch (e) {
//     console.error(e);
// }


bot.start((ctx) => createUser(ctx))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('text', (ctx, client) => handleText(ctx, client))
bot.on('photo', (ctx) => console.log(ctx.update.message.photo))
bot.launch()



async function dropTable(tableName){
    let res = await client.execute(`DROP TABLE ${tableName}`)
    console.log(res)
}

async function clearTable(tableName){
    let res = await client.execute(`DELETE FROM ${tableName}`)
    console.log(res)
}


async function createContent() {
  const content = await client.execute(`CREATE TABLE content (
    id TEXT PRIMARY KEY,
    user_id INTEGER,
    key TEXT,
    value TEXT,
    timestamp INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
`);

  console.log(content);
                                  
}


function serveHomePage(res){
    res.setHeader("Content-Type", "text/html");
    fs.readFile('./static/index.html', (err, data) => {
      if(err) {
        console.log(err);
        res.end();
      } else {
        res.write(data);
        console.log('success');
        res.end();
      }
    })
  }
  
  