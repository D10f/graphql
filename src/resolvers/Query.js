const Query = {
  users(parent, args, { db }, info) {
    const query = args.query ? args.query.toLowerCase() : undefined;
    return query
      ? db.userData.filter(user => user.name.toLowerCase().includes(query))
      : db.userData
  },
  posts(parent, args, { db }, info) {
    const query = args.query ? args.query.toLowerCase() : undefined;
    return query
      ? db.postData.filter(post => post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query))
      : db.postData
  },
  comments(parent, args, { db }, info) {
    return db.commentData;
  }
};

export default Query;
