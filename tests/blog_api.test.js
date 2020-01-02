const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    }
]

beforeAll(async () => {
    await User.deleteMany({})
})

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length)
})

test('id is defined', async () => {
    const response = await api.get('/api/blogs')

    const id = response.body.map(r => r.id)

    const definedTrue = id.reduce((x, item) => {
        if (x === true) {
            item === undefined ? x = false : x = true
        }
        return x
    }, true)

    expect(definedTrue).toBe(true)
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(title).toContain(
        'Type wars'
    )
})

test('new blog with no likes is assigned 0', async () => {
    const newBlog = {
        title: "Test",
        author: "Nolikes",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const nolikes = response.body.filter(r => r.title === 'Test')
    expect(nolikes[0].likes).toBe(0)
})

test('new blog must contain title and url', async () => {
    const newBlog = {
        author: 'no title or url'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('new user can be added', async () => {
    const newUser = {
        username: 'testuser1',
        name: 'test user',
        password: 'test'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')

    const username = response.body.map(r => r.username)

    expect(username).toContain(
        'testuser1'
    )
})

test('username with less than 3 characters is not accepted', async () => {
    const newUser = {
        username: 'ts',
        name: 'too short',
        password: '1234'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
})

test('password with less than 3 characters is not accepted', async () => {
    const newUser = {
        username: 'test2',
        name: 'too short',
        password: '12'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
})

test('username must be unique', async () => {
    const newUser = {
        username: 'testuser1',
        name: 'not unique',
        password: '12345'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})