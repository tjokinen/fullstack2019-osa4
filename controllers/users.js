const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs')

    response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {

    try {
        const body = request.body
        if (body.username.length < 3 || body.password.length < 3) {
            return response.status(400).json({ error: 'username and password must have at least 3 characters' })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User(
            {
                username: body.username,
                name: body.name,
                password: passwordHash
            }
        )

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } catch (exception) {
        next(exception)
    }

})

module.exports = usersRouter