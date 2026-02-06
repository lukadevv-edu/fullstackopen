const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) =>
  blogs.reduce((counter, each) => counter + each.likes, 0);

const favoriteBlog = (blogs) => {
  return [...blogs].sort((a, b) => b.likes - a.likes)[0];
};

const mostBlogs = (blogs) => {
  let diccionary = {};

  for (const blog of blogs) {
    diccionary[blog["author"]] = diccionary[blog["author"]]
      ? diccionary[blog["author"]] + 1
      : 1;
  }

  let max = -1;
  let author = null;

  for (const key in diccionary) {
    if (diccionary[key] >= max) {
      max = diccionary[key];
      author = key;
    }
  }

  return {
    author,
    blogs: max,
  };
};

const mostLikes = (blogs) => {
  let diccionary = {};

  for (const blog of blogs) {
    diccionary[blog["author"]] = diccionary[blog["author"]]
      ? diccionary[blog["author"]] + blog.likes
      : blog.likes;
  }

  let max = -1;
  let author = null;

  for (const key in diccionary) {
    if (diccionary[key] >= max) {
      max = diccionary[key];
      author = key;
    }
  }

  return {
    author,
    likes: max,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
