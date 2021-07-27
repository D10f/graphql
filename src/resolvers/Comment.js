const Comment = {
  author(parent, args, { db }, info) {
    return db.userData.find(user => user.id === parent.author);
  },
  post(parent, args, { db }, info) {
    return db.postData.find(post => post.id === parent.post);
  }
};

export default Comment;
