const dummy = (blogs) => {
    return 1
}

const totalLikes = blogs => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = blogs => {
    return blogs.reduce((a, b) => (b.likes > a.likes) ? b : a)
}

const mostBlogs = blogs => {

    var map = blogs.reduce((obj, b) => {
        obj[b.author] = ++obj[b.author] || 1
        return obj
    }, {})

    var name = Object.keys(map).reduce((a, b) => map[a] > map[b] ? a : b)

    return {
        author: name,
        blogs: map[name]
      }
}

const mostLikes = blogs => {

    var map = blogs.reduce((obj, b) => {
        obj[b.author] = obj[b.author]+b.likes || b.likes
        return obj
    }, {})

    var name = Object.keys(map).reduce((a, b) => map[a] > map[b] ? a : b)

    return {
        author: name,
        likes: map[name]
      }
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}