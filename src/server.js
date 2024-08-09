import bodyParser from 'body-parser';
import express from 'express';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js'

(async () => {
  //Create an express application
  const app = express(); 
  //default port to listen
  const port = process.env.PORT || 8082; 
  
  //use middleware so post bodies are accessable as req.body
  app.use(bodyParser.json()); 
  app.use(express.urlencoded({ extended: true })) //for requests from forms-like data

  // Root URI call
  app.get( "/", ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get( "/filteredimage", async ( req, res ) => {
    const {image_url} = req.query
    // validate image_url parameter
    if (!image_url) {
      return res.status(400).send({message: "The image_url is required"})
    }

    filterImageFromURL(image_url)
      .then(filterImagePath => {
          res.status(200).sendFile(filterImagePath, err => {
            if (err) {
              return res.status(400).send({message: err})
            }
            else {
              deleteLocalFiles([filterImagePath])
            }
          })
      })
      .catch(err => {
        return res.status(422).send({message: err})
      })
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
