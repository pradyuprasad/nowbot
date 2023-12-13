import { Snowflake } from "@theinternetfolks/snowflake";
import client from '../lib/sqlClient.js'

const handleText = async (ctx) => {
  let user = ctx.update.message.from
  //console.log(ctx.update)
  let text = ctx.update.message.text
  let split_text = text.split(' ')
  //console.log(split_text)

  if(text[0] != '/' || split_text.length < 1) {
    ctx.reply('That was not a valid input')
  } 

  else if (split_text.length == 1) {
    var outputurl = `The URL for that is www.domainname.com/${user.id}/${split_text[0].slice(1)}`
    ctx.reply(outputurl)
  }
 

  else{

    try {
      let key = split_text[0].slice(1)
      let value = split_text.slice(1).reduce((a, b) => a + ' ' + b)
      let id = Snowflake.generate()
      let user_id = user.id
      console.log(user.id)
      let time = Date.now()
      
      if (key == "get"){

        try {
          const result = await client.execute(`SELECT * FROM content WHERE user_id = ${user.id} AND key = ${value}`);
          let final = `${value}\n\n`
          for (const i of result.rows) {
            let date = new Date(i.timestamp)
            let day = date.getDate(); 
            let month = date.getMonth() + 1; // Month (January is 0, so add 1 to get the correct month number)
            let year = date.getFullYear(); 
            let formattedDate = `${day}/${month}/${year}`;
            final += `<b>${i.value}</b> - ${formattedDate}\n`
          }

          console.log(final)
          ctx.replyWithHTML(final)

  

        }

        catch(e) {
          if (e.message.includes('SQL_INPUT_ERROR: SQL input error: no such column:')) {
            ctx.reply("Invalid query")
          }
          else {
            console.log(e.message)
            ctx.reply(e)
        }
      }

      }

      else {

        const result = await client.execute({
          sql: "insert into content(id, user_id, key, value, timestamp) values (:id, :user_id, :key, :value, :timestamp)", 
          args: { id: id, user_id: user_id, key: key, value: value, timestamp: time}
  
        });
        console.log(result)
        ctx.reply('It has been added')
  

      }



    }

    catch(e) {
      console.log(e)
      ctx.reply(e)
    }
  }

  return 
}


export default handleText