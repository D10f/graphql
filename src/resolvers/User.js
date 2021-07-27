const User = {
  posts(parent, args, { db }, info) {
    return db.postData.filter(post => post.author === parent.id);
  },
  comments(parent, args, { db }, info) {
    return db.commentData.filter(comment => comment.author === parent.id)
  }
};

export default User;
