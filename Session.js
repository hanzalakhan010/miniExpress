
export default class SessionManager {
    constructor() {
        if (SessionManager._instance) {
            return SessionManager._instance
        }
        SessionManager._instance = this
        this.sessions = {}
        this.flashes = {}
    }
    set(data, res) {
        const sessionId = crypto.randomBytes(16).toString('hex')
        this.sessions[sessionId] = data
        res.setHeader(
            'Set-Cookie', `sessionId=${sessionId}; HttpOnly; Path=/`,
        )
    }
    #parseCookies(req) {
        const raw = req?.headers?.cookie || ''
        return Object.fromEntries(raw.split('; ').map(cookie => cookie.split('=')))
    }
    hasSession(req) {
        const cookies = this.#parseCookies(req)
        if (this.sessions[cookies?.sessionId]) return true
        return false
    }
    getSession(req) {
        const cookies = this.#parseCookies(req)
        if (this.sessions[cookies?.sessionId]) return this.sessions[cookies?.sessionId]
        return false
    }
    deleteSession(req) {
        const cookies = this.#parseCookies(req)
        this.sessions[cookies?.sessionId] = null
        return true
    }
}