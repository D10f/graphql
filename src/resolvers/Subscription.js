// Main difference with other resolvers is that subscription uses objects rather than methods

const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const postExists = db.postData.find(post => post.id === postId);

      if (!postExists) {
        throw new Error('No post found with that id.');
      }

      return pubsub.asyncIterator(`comment ${postId}`);
    }
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post');
    }
  }
};

export default Subscription;
