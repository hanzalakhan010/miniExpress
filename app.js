import { auth } from "./backened.js";
import JWT from "./JWT.js";
import MiniExpress from "./miniExpress.js";
import user from "./userRoutes.js";
import { renderTemplate } from "./utils.js";
import SessionManager from "./Session.js";
import { logger } from "./logger.js";


const app = new MiniExpress()
app.staticFolder = '/assets'
const session = new SessionManager()
const jwt = new JWT('suupper-secret-key')



app.use(logger)

app.use('/user', user)
function checkSession(req, res) {
    if (session.hasSession(req)) {
        app.redirect(res, `/user/${session.getSession(req)?.id}/dashboard`)
        return
    }
}

app.get('/login', checkSession, (req, res) => {
    res.end(renderTemplate('login.html', res))
})

app.post('/login', async (req, res) => {
    const user = await app.handleForm(req)
    const userAuth = auth(user)
    // console.log(userAuth)
    if (userAuth) {
        //     session.set(userAuth, res)
        const jwtToken = jwt.createJWT({ sub: userAuth })
        res.setHeader('Set-Cookie', `jwtToken=${jwtToken}; httpOnly; Path=/`)
        app.redirect(res, '/dashboard')
    } else {
        app.redirect(res, '/login')
    }

})

app.get('/logout', (req, res) => {
    // session.deleteSession(req)
    res.setHeader('Set-Cookie', `jwtToken=; httpOnly; Path=/; MaxAge=0`)
    app.redirect(res, '/login')

})

app.get('/dashboard', jwt.jwtProtetected, (req, res) => {
    // if (session.hasSession(req)) {
    return res.end(renderTemplate('dashboard.html', res, req?.user?.sub))
    // }
    // return app.redirect(res, '/login')

})




app.get('/forgot_password', (req, res) => {

    res.end(renderTemplate('forgot_password.html', res))
})
app.get('/reset_password', (req, res) => {
    res.end(renderTemplate('reset_password.html', res))
})

const port = 3000

app.listen(port, () => { console.log('Running server on port', port) })