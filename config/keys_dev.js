if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb+srv://resource-hub:resource.hub2020!!@resource-hub-cluster-gmsj7.mongodb.net/test?retryWrites=true&w=majority',
        secretOrKey: 'nothing_new'
    };
  } else {
    module.exports = {
        mongoURI:'mongodb://localhost:27017/ResourceHub'
    }
  }

