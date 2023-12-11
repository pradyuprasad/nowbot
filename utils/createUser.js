import { Snowflake } from "@theinternetfolks/snowflake";
import client from '../lib/sqlClient.js'
  
const createUser = async (ctx) => {
  try {
    const table = await client.execute("select * from users");
    console.log(table);
    let user = ctx.update.message.from;
    let id = Snowflake.generate();
    let user_id = user.id;
    console.log(user_id);
    let createdAt = Date.now();
    let username = user.username;
    const result = await client.execute({
      sql: "insert into users (id, created_at, user_id, username) values (:id, :created_at, :user_id, :username)",
      args: {
        id: id,
        created_at: createdAt,
        user_id: user_id,
        username: username,
      },
    });

    console.log(result);

    // if(result.rowsAffected < 1){
    //   ctx.reply('You already have an account.')
    // }

    // else{
    //   ctx.reply('Account created!')
    // }
  } catch (err) {
    if (
      err.cause.message ==
      "SQLite error: UNIQUE constraint failed: users.user_id"
    ) {
      ctx.reply(`Account already exists!`);
    } else {
      ctx.reply(`${err} happened, please try again!`);
    }
  }
}
// if the same users presses start twice SQLite is going to give an error, so we need a try and catch

export default createUser