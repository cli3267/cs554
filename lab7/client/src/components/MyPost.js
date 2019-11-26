import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import Img from 'react-image';
import {
  DELETE_PHOTO,
  USER_POSTED_PHOTO,
  UPDATE_PHOTO,
  BINNED_IMAGES,
} from '../queries';

class MyPost extends Component {
  render() {
    let uploadImage = (
      <div className='text-center'>
        <Link to='/new-post'>
          <button className='btn btn-primary'>Upload Image</button>
        </Link>
      </div>
    );
    return (
      <div>
        {uploadImage}
        <Query query={USER_POSTED_PHOTO}>
          {({ data }) => {
            if (!data) return null;
            let { userPostedImages } = data;
            return (
              <div className='row'>
                {userPostedImages.map(photo => {
                  return (
                    <div
                      className='card col-sm-6 text-center text-black'
                      key={photo.id}
                    >
                      <div className='card-body'>
                        <Img className='card-img-top' src={photo.url} />
                        <h5 className='card-title'>{photo.author}</h5>
                        <br />
                        <p className='card-text'>{photo.description}</p>
                        <br />
                        {photo.binned === false ? (
                          <Mutation
                            mutation={UPDATE_PHOTO}
                            update={(cache, { data: { updateImage } }) => {
                              const { binnedImages } = cache.readQuery({
                                query: BINNED_IMAGES,
                              });
                              cache.writeQuery({
                                query: BINNED_IMAGES,
                                data: {
                                  binnedImages: binnedImages.concat([
                                    updateImage,
                                  ]),
                                },
                              });
                            }}
                          >
                            {(updateImage, { data, loading, error }) => (
                              <form
                                className='form'
                                onSubmit={e => {
                                  e.preventDefault();
                                  updateImage({
                                    variables: {
                                      id: photo.id,
                                      url: photo.url,
                                      author: photo.author,
                                      description: photo.description,
                                      user_posted: photo.user_posted,
                                      binned: true,
                                    },
                                  });
                                  if (error) alert('Could not add to Bin');
                                  alert('Added To Bin');
                                }}
                              >
                                <button className='btn btn-primary' type='submit'>
                                  Add To Bin
                                </button>
                              </form>
                            )}
                          </Mutation>
                        ) : (
                          <Mutation
                            mutation={UPDATE_PHOTO}
                            update={(cache, { data: { updateImage } }) => {
                              const { binnedImages } = cache.readQuery({
                                query: BINNED_IMAGES,
                              });
                              cache.writeQuery({
                                query: BINNED_IMAGES,
                                data: {
                                  binnedImages: binnedImages.filter(
                                    e => e.id !== photo.id,
                                  ),
                                },
                              });
                            }}
                          >
                            {(updateImage, { data, loading, error }) => (
                              <form
                                className='form'
                                onSubmit={e => {
                                  e.preventDefault();
                                  updateImage({
                                    variables: {
                                      id: photo.id,
                                      url: photo.url,
                                      author: photo.author,
                                      description: photo.description,
                                      user_posted: photo.user_posted,
                                      binned: false,
                                    },
                                  });
                                  if (error) alert('Could not remove from Bin');
                                  alert('Removed From Bin');
                                }}
                              >
                                <br />
                                <button className='btn btn-primary' type='submit'>
                                  Removed From Bin
                                </button>
                              </form>
                            )}
                          </Mutation>
                        )}
                        <Mutation
                          mutation={DELETE_PHOTO}
                          update={(cache, { data: { deleteImage } }) => {
                            const { userPostedImages } = cache.readQuery({
                              query: USER_POSTED_PHOTO,
                            });
                            cache.writeQuery({
                              query: USER_POSTED_PHOTO,
                              data: {
                                userPostedImages: userPostedImages.filter(
                                  e => e.id !== photo.id,
                                ),
                              },
                            });
                          }}
                        >
                          {(deleteImage, { data, loading, error }) => (
                            <form
                              className='form'
                              onSubmit={e => {
                                e.preventDefault();
                                deleteImage({
                                  variables: {
                                    id: photo.id,
                                  },
                                });
                                if (error) alert('Image could not be deleted');
                                alert('Image Deleted');
                              }}
                            >
                              <br />
                              <button
                                className='btn btn-primary row justify-content-center text-center'
                                type='submit'
                              >
                                Delete
                              </button>
                            </form>
                          )}
                        </Mutation>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default MyPost;
