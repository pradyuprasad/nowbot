import { Snowflake } from "@theinternetfolks/snowflake";
import client from '../lib/sqlClient.js'

const handleText = async (ctx) => {
  let user = ctx.update.message.from
  //console.log(ctx.update)
  let text = ctx.update.message.text
  let split_text = text.split(' ')
  //console.log(split_text)

  if(text[0] != '/' || split_text.length < 2) {
    ctx.reply('That was not a valid input')
  } 
 

  else{

    try {
      let key = split_text[0].slice(1)
      let value = split_text.slice(1).reduce((a, b) => a + ' ' + b)
      let id = Snowflake.generate()
      let user_id = user.id
      console.log(user.id)
      let time = Date.now()
      const result = await client.execute({
        sql: "insert into content(id, user_id, key, value, timestamp) values (:id, :user_id, :key, :value, :timestamp)", 
        args: { id: id, user_id: user_id, key: key, value: value, timestamp: time}

      });
      console.log(result)
      ctx.reply('It has been added')


    }

    catch(e) {
      console.log(e)
      ctx.reply(e)
    }
  }

  return 
}


export default handleText