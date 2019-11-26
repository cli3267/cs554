const { ApolloServer, gql } = require('apollo-server');
const { RedisCache } = require('apollo-server-cache-redis');
const { RESTDataSource } = require('apollo-datasource-rest');
const uuid = require('uuid');

const UnsplashAPI = require('unsplash-js').default;
const { toJson } = require('unsplash-js');

APP_ACCESS_KEY =
  '31986505e28e0112b89eb95fed11c9eb41dac3af459b07aaa7ff5f9dcf56808d';

let unsplash = new UnsplashAPI({ accessKey: `${APP_ACCESS_KEY}` });

const fetch = require('node-fetch');
global.fetch = fetch;

const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
client.on('error', function(err) {
  console.log('Error ' + err);
});

class Unsplash extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = unsplash._apiUrl;
  }

  async getunSplashImage(pageNum) {
    if (!pageNum) throw 'Error: no pageNum was given';
    let result = [];
    return await unsplash.photos
      .listPhotos(pageNum, 15)
      .then(toJson)
      .then(async photos => {
        for (let photo of photos) {
          let photoInfo = {
            id: photo.id,
            url: photo.urls.regular,
            author: photo.user.name,
            description: photo.description,
            user_posted: false,
            binned: false,
          };
          await client.sadd('unsplashImgs', JSON.stringify(photoInfo));
          result.push(photoInfo);
        }
        return result;
      });
  }
  async binnedImages() {
    let binnedImgs = [];
    let splashImgs = await client.smembersAsync('binnedImgs');
    if (!splashImgs) return null;
    else {
      for (let img of splashImgs) {
        let parseImg = JSON.parse(img);
        // only pushing when image is binned
        if (parseImg.binned === true) {
          binnedImgs.push(parseImg);
        }
      }
    }
    return binnedImgs;
  }

  async updateImage(id, url, author, description, user_posted, binned) {
    let updatedimg = {
      id,
      url,
      author,
      description,
      user_posted,
      binned,
    };
    let splashImgs = await client.smembersAsync('unsplashImgs');
    splashImgs = splashImgs.map(x => JSON.parse(x));
    let img = splashImgs.find(x => x.id === id);

    let myImgs = await client.lrangeAsync('photos', 0, -1);
    myImgs = myImgs.map(x => JSON.parse(x));
    let myImg = myImgs.find(x => x.id === id);
    if (!img && !myImg) {
      //image is not found
      return null;
    } else if (img && !myImg) {
      //if the image is already binned
      if (binned) {
        await client.sremAsync('unsplashImgs', JSON.stringify(img));
        await client.sadd('binnedImgs', JSON.stringify(updatedimg));
        await client.sadd('unsplashImgs', JSON.stringify(updatedimg));
      } else {
        //not binned
        await client.sremAsync('unsplashImgs', JSON.stringify(img));
        await client.sremAsync('binnedImgs', JSON.stringify(img));
        await client.sadd('unsplashImgs', JSON.stringify(updatedimg));
      }
    } else if (!img && myImg) {
      if (binned) {
        await client.lremAsync('photos', 0, JSON.stringify(myImg));
        await client.sadd('binnedImgs', JSON.stringify(updatedimg));
        await client.lpush('photos', JSON.stringify(updatedimg));
      } else {
        //not binned
        await client.lremAsync('photos', 0, JSON.stringify(myImg));
        await client.sremAsync('binnedImgs', JSON.stringify(myImg));
        await client.lpush('photos', JSON.stringify(updatedimg));
      }
    }
    return updatedimg;
  }

  async userPostedImages() {
    let splashImgs = await client.lrangeAsync('photos', 0, -1);
    let result = [];
    try {
      for (let img of splashImgs) {
        let parseImg = JSON.parse(img);
        if (parseImg.user_posted) {
          result.push(parseImg);
        } else {
          continue;
        }
      }
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async uploadImage(url, description, author) {
    let uploadImage = {
      id: uuid(),
      url,
      author,
      description,
      user_posted: true,
      binned: false,
    };
    try {
      await client.lpush('photos', JSON.stringify(uploadImage));
    } catch (error) {
      console.log(error);
    }
    return uploadImage;
  }

  async deleteImage(id) {
    if (!id) throw 'No ID provided';
    let splashImgs = await client.lrangeAsync('photos', 0, -1);
    for (let img of splashImgs) {
      let parseImg = JSON.parse(img);
      if (parseImg.id === id) {
        await client.lrem('photos', 0, img);
      }
    }
  }
}
const typeDefs = gql`
  type ImagePost {
    id: ID!
    url: String!
    author: String!
    description: String
    user_posted: Boolean!
    binned: Boolean!
  }

  type Query {
    unsplashImages(pageNum: Int): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }

  type Mutation {
    uploadImage(url: String!, description: String, author: String): ImagePost
    updateImage(
      id: ID!
      url: String
      author: String
      description: String
      user_posted: Boolean
      binned: Boolean
    ): ImagePost
    deleteImage(id: ID!): ImagePost
  }
`;

const resolvers = {
  Query: {
    unsplashImages: async (_, args) => {
      const img = new Unsplash();
      return await img.getunSplashImage(args.pageNum);
    },
    binnedImages: async () => {
      const img = new Unsplash();
      return await img.binnedImages();
    },
    userPostedImages: async () => {
      const img = new Unsplash();
      return await img.userPostedImages();
    },
  },
  Mutation: {
    uploadImage: async (_, args) => {
      const img = new Unsplash();
      return await img.uploadImage(args.url, args.description, args.author);
    },
    updateImage: async (_, args) => {
      const img = new Unsplash();
      return await img.updateImage(
        args.id,
        args.url,
        args.author,
        args.description,
        args.user_posted,
        args.binned,
      );
    },
    deleteImage: async (_, args) => {
      const img = new Unsplash();
      return await img.deleteImage(args.id);
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: new RedisCache({
    host: 'localhost',
    port: 6379,
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
