import gql from 'graphql-tag';

const GET_PHOTOS = gql`
  query($pageNum: Int!) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      author
      description
      user_posted
      binned
    }
  }
`;

const BINNED_IMAGES = gql`
  query {
    binnedImages {
      id
      url
      author
      description
      user_posted
      binned
    }
  }
`;

const USER_POSTED_PHOTO = gql`
  query {
    userPostedImages {
      id
      url
      author
      description
      user_posted
      binned
    }
  }
`;

const UPLOAD_PHOTO = gql`
  mutation uploadImage($url: String!, $description: String, $author: String) {
    uploadImage(url: $url, description: $description, author: $author) {
      id
      url
      author
      description
      user_posted
      binned
    }
  }
`;

const UPDATE_PHOTO = gql`
  mutation updateImage(
    $id: ID!
    $url: String
    $author: String
    $description: String
    $user_posted: Boolean
    $binned: Boolean
  ) {
    updateImage(
      id: $id
      url: $url
      author: $author
      description: $description
      user_posted: $user_posted
      binned: $binned
    ) {
      id
      url
      author
      description
      user_posted
      binned
    }
  }
`;

const DELETE_PHOTO = gql`
  mutation deleteImage($id: ID!) {
    deleteImage(id: $id) {
      id
      url
      author
      description
      user_posted
      binned
    }
  }
`;

export {
  GET_PHOTOS,
  BINNED_IMAGES,
  USER_POSTED_PHOTO,
  UPLOAD_PHOTO,
  UPDATE_PHOTO,
  DELETE_PHOTO,
};
