
## database

- set up sqlite3

## commands

- /key value
- /key
- /all
- 
- /start
- /help


id user_id key value timestamp


 const url = req.url
  console.log(url)
  let urlList = url.split('/')
  console.log(urlList)

  if(urlList.length < 2){
    serveHomePage()
  }

  else if (urlList.length < 3) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(404);
    res.end(JSON.stringify("That is not a valid route."));
  }

  else if(urlList.length < 4){
      // check if key exists
      res.writeHead(200);
      res.end("text")
      // else send back "invalid user ID or key"
  }

  res.end("What???");
};


