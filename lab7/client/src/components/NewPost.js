import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { USER_POSTED_PHOTO, UPLOAD_PHOTO } from '../queries';

class NewPost extends Component {
  render() {
    let url, description, author;
    let body = (
      <Mutation
        mutation={UPLOAD_PHOTO}
        update={(cache, { data: { uploadImage } }) => {
          const { userPostedImages } = cache.readQuery({
            query: USER_POSTED_PHOTO,
          });
          cache.writeQuery({
            query: USER_POSTED_PHOTO,
            data: { userPostedImages: userPostedImages.concat([uploadImage]) },
          });
        }}
      >
        {(uploadImage, { data }) => (
          <form
            className='form'
            onSubmit={e => {
              e.preventDefault();
              uploadImage({
                variables: {
                  url: url.value,
                  description: description.value,
                  author: author.value,
                },
              });
              url.value = '';
              description.value = '';
              author.value = '';
              alert('Uploaded Image');
            }}
          >
            <div className='form-group'>
              <label>
                URL
                <br />
                <input
                  ref={node => {
                    url = node;
                  }}
                  required
                  autoFocus={true}
                  className='form-control'
                />
              </label>
            </div>
            <br />
            <div className='form-group'>
              <label>
                Description
                <br />
                <input
                  ref={node => {
                    description = node;
                  }}
                  required
                  autoFocus={true}
                  className='form-control'
                />
              </label>
            </div>
            <br />
            <div className='form-group'>
              <label>
                Author
                <br />
                <input
                  ref={node => {
                    author = node;
                  }}
                  required
                  autoFocus={true}
                  className='form-control'
                />
              </label>
            </div>
            <br />
            <button type='submit' className='btn btn-primary'>
              Upload Image
            </button>
          </form>
        )}
      </Mutation>
    );
    return <div className='row justify-content-center text-center'>{body}</div>;
  }
}

export default NewPost;
