const path = require('path');
const hapi = require('hapi');
const inert = require('inert');
const mongo = require('mongodb');

const plugins = [inert]
const server = new hapi.Server();

var MongoClient = mongo.MongoClient;

server.connection({
    routes: {
        files: {
            relativeTo: path.join(__dirname, 'public')
        }
    },
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
})

server.register(plugins, (err) => {
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true
            }
        }
    } )

    server.route({
        method: 'POST',
        path: '/',
        handler: (req,res)=>{
            MongoClient.connect(process.env.MLAB_URI, function(err, db) {
                db.collection('results').insert(req.payload);
                res()
            });
        }
    } )

    server.start((err)=>{
        console.log('server started')
    })
})