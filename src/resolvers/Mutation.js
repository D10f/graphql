import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  createUser(parent, args, { db }, info) {
    const isEmailTaken = db.userData.some(user => user.email === args.data.email.toLowerCase());

    if (isEmailTaken) {
      throw new Error('Email is already in use.');
    }

    const user = {
      id: uuidv4(),
      ...args.data
    };

    db.userData.push(user);

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIdx = db.userData.findIndex(user => user.id === args.id);

    if (userIdx < 0) {
      throw new Error('No user found for that id');
    }

    // Delete the user
    const deletedUser = db.userData.splice(userIdx, 1);

    // Delete posts by that user
    const postsFlaggedForDeletion = db.postData.filter(post => post.author === args.id);

    // Delete all comments within posts that are to be deleted
    postsFlaggedForDeletion.forEach(post => {
      post.comments = post.comments.filter(comment => comment.author !== args.id);
    });

    // Delete comments made by this user elsewhere
    db.commentData = db.commentData.filter(comment => comment.author !== args.id);

    db.postData = db.postData.filter(post => post.author !== args.id);

    return deletedUser[0];
  },
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.userData.find(user => user.id === id);

    if (!user) {
      throw new Error('No user found with that id.');
    }

    // Verify none of the fields provided is null to avoid potential data corruption
    Object.entries(data).forEach(([ key, value ]) => {
      if (value !== null) {
        user[key] = value;
      }
    });

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const isValidUser = db.userData.some(user => user.id === args.data.author);

    if (!isValidUser) {
      throw new Error('No user found with that id.');
    }

    const post = {
      id: uuidv4(),
      ...args.data
    };

    db.postData.push(post);

    // Send a pubsub event notification only if the post is published
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      });
    }

    return post;
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const post = db.postData.find(post => post.id === id);

    if (!post) {
      throw new Error('No post found for that id.');
    }

    // TODO: use an enum
    let mutationType = 'UPDATED';

    Object.entries(data).forEach(([ key, value ]) => {
      // Verify none of the fields provided is null to avoid potential data corruption
      if (value !== null) {

        // Verify the published field has changed, signaling an updated or deleted post
        if (key === 'published') {
          mutationType = value ? 'CREATED' : 'DELETED';
        }

        // Finally update the post value
        post[key] = value;
      }
    });

    // Only publish any updates if post was already published, or the post has been deleted
    if (post.published || mutationType === 'DELETED') {
      pubsub.publish('post', {
        post: {
          mutation: mutationType,
          data: post
        }
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIdx = db.postData.findIndex(post => post.id === args.id);

    if (postIdx < 0) {
      throw new Error('No post found with that id.');
    }

    // Delete the post
    const [removedPost] = db.postData.splice(postIdx, 1);

    // Delete post comments
    const commentsToRemove = removedPost.comments.map(comment => comment.id);
    db.commentData = db.commentData.filter(comment => !commentsToRemove.includes(comment.id));

    if (removedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: removedPost
        }
      });
    }

    return removedPost;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const author = db.userData.find(user => user.id === args.data.author);

    if (!author) {
      throw new Error('No user found with that id.');
    }

    const post = db.postData.find(post => post.id === args.data.post);

    if (!post) {
      throw new Error('No post found with that id');
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    db.commentData.push(comment);

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    });

    return comment;
  },
  updateComment(parent, { id, data }, { db, pubsub }, info){
    const comment = db.commentData.find(comment => comment.id = id);

    if (!comment) {
      throw new Error('No comment found with that id.');
    }

    // Verify none of the fields provided is null to avoid potential data corruption
    Object.entries(data).forEach(([ key, value]) => {
      if (value !== null) {
        comment[key] = value;
      }
    });

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIdx = db.commentData.findIndex(comment => comment.id === args.id);

    if (commentIdx < 0) {
      throw new Error('Cannot find any comments with that id.');
    }

    const [removedComment] = db.commentData.splice(commentIdx, 1);

    db.postData.forEach(post => {
      post.comments = post.comments.filter(comment => comment.id !== args.id)
    });

    pubsub.publish(`comment ${removedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: removedComment
      }
    });

    return removedComment;
  }
};

export default Mutation;
