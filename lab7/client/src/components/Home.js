import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import Img from 'react-image';

import './App.css';
import { GET_PHOTOS, UPDATE_PHOTO, BINNED_IMAGES } from '../queries';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      pageNum: this.state.pageNum + 1,
    });
  }

  render() {
    let queryPhotos = (
      <Query query={GET_PHOTOS} variables={{ pageNum: this.state.pageNum }}>
        {({ data }) => {
          if (!data) return null;
          const { unsplashImages } = data;
          return (
            <div className='row'>
              {unsplashImages.map(photo => {
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
                                if (error) alert('Could not remove from bin');
                                alert('Removed From Bin');
                              }}
                            >
                              <button className='btn btn-primary' type='submit'>
                                Removed From Bin
                              </button>
                            </form>
                          )}
                        </Mutation>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      </Query>
    );
    return (
      <div>
        {queryPhotos}
        <div className='text-center'>
          <button onClick={this.handleClick} className='btn btn-primary'>
            Get More Photos
          </button>
        </div>
      </div>
    );
  }
}

export default Home;
