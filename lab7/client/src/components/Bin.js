import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import Img from 'react-image';

import './App.css';
import { BINNED_IMAGES, UPDATE_PHOTO } from '../queries';

class Bin extends Component {
  render() {
    return (
      <div>
        <Query query={BINNED_IMAGES}>
          {({ data }) => {
            if (!data) {
              return null;
            }
            const { binnedImages } = data;
            return (
              <div className='row'>
                {binnedImages.map(photo => {
                  return (
                    <div
                      className='card col-sm-6 text-center text-black'
                      key={photo.id}
                    >
                      <div className='card-body'>
                        <Img className='card-img-top' src={photo.url} />
                        <h5 className='card-title'>{photo.author}</h5>
                        <br />
                        <p>{photo.description}</p>
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

export default Bin;
