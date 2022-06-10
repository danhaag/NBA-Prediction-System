const request = require('superagent');
const jsonfile = require('jsonfile')

const file = 'data.json'

const gamesObject = {}
let counter = 0;

function delay() {
  return new Promise(function(resolve, reject){
    setTimeout(resolve, 3000)
  })
}


 const constructGames = async (page) => {

  //Specific parse for page to url TBD (TODO)
  let url = page;

  try{
    request
    .get(url)
    .then(async res  =>{

      let data = res.body.data
      let meta = res.body.meta;

      console.log(meta)

      for(const id in data){


        gamesObject[counter] = data[id];
        counter++

      }

      await delay();

       if(meta.current_page != meta.total_pages){
         constructGames(page+1)
       }
       else{
         jsonfile.writeFile(file, gamesObject, function (err) {
           if (err) console.error(err)
         })
       }
    })
  }catch(err){
    console.log(err)
  }
  }
  try{
  constructGames(1)
  }
  catch(err){
    console.log(err)
  }
