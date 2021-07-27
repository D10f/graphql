const Post = {
  author(parent, args, { db }, info) {
    return db.userData.find(user => user.id === parent.author);
  },
  comments(parent, args, { db }, info) {
    return db.commentData.filter(comment => comment.post === parent.id)
  }
};

export default Post;
