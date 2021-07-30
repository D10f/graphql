const userData = [
  {
    id: '1',
    name: 'Thomas',
    email: 'tom@example.com',
    age: 20
  }, {
    id: '2',
    name: 'Wendy',
    email: 'wen@example.com',
    age: 22
  }, {
    id: '3',
    name: 'Andrea',
    email: 'andrea@example.com',
    age: 22
  }
];

const postData = [
  {
    id: 'a',
    author: '2',
    title: 'Cooking Indian Delicacies',
    body: 'Once upon a time in Bangladesh...',
    published: false,
    comments: ['aa', 'dd']
  }, {
    id: 'b',
    author: '3',
    title: 'Preparing Pizza tomato base',
    body: 'It\'s a me, Mario',
    published: true,
    comments: ['bb']
  }, {
    id: 'c',
    author: '2',
    title: 'Kitchen knives maintainance',
    body: 'It all starts with a little bit of...',
    published: true,
    comments: ['cc']
  }
];

const commentData = [
  {
    id: 'aa',
    text: 'Love the content!',
    author: '1',
    post: 'a'
  }, {
    id: 'bb',
    text: 'Pls make another one with Japanese food',
    author: '2',
    post: 'b'
  }, {
    id: 'cc',
    text: 'Ugh, another day in the office...',
    author: '3',
    post: 'c'
  }, {
    id: 'dd',
    text: 'What is this??',
    author: '1',
    post: 'a'
  }
];

const db = {
  userData,
  postData,
  commentData
};

export default db;
