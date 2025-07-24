
import crypto from 'crypto'

export default class JWT {
    constructor(secretKey) {
        this.secretKey = secretKey
        this.jwtProtetected = this.jwtProtetected.bind(this)
        this.jwtProtetectedUpdated = this.jwtProtetectedUpdated.bind(this)
    }
    #parseCookies(req) {
        const raw = req?.headers?.cookie || ''
        return Object.fromEntries(raw.split('; ').map(cookie => cookie.split('=')))
    }
    base64urlEncode(input) {
        return Buffer.from(input)
            .toString('base64')
            .replace(/=/g, '')       // Remove padding
            .replace(/\+/g, '-')     // Replace '+' with '-'
            .replace(/\//g, '_');    // Replace '/' with '_'
    }

    base64urlDecode(input) {
        input = input
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        while (input.length % 4) {
            input += '=';
        }
        return Buffer.from(input, 'base64').toString();
    }
    createJWT(payloadPartials) {
        const payload = {
            ...payloadPartials,
            // sub: 'user123',
            // role: 'admin',
            iat: Math.floor(Date.now() / 100),
            exp: Math.floor(Date.now() / 1000) + (100)
        };

        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        const headerEncoded = this.base64urlEncode(JSON.stringify(header));
        const payloadEncoded = this.base64urlEncode(JSON.stringify(payload));
        const data = `${headerEncoded}.${payloadEncoded}`;
        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(data)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        return `${data}.${signature}`;
    }
    jwtProtetected(req, res) {
        const cookies = this.#parseCookies(req)
        if (!cookies['jwtToken']) return res.writeHead(401).end('Unauthorized')
        const userIdentity = this.verifyJWT(cookies['jwtToken'])
        if (!userIdentity) return res.writeHead(401).end('Unauthorized')
        req.user = userIdentity
    }
    jwtProtetectedUpdated(req, res, next) {
        const cookies = this.#parseCookies(req)
        if (!cookies?.['jwtToken']) return res.status(401).send('Unauthorized1')
        const userIdentity = this.verifyJWT(cookies['jwtToken'])
        if (!userIdentity) return res.status(401).send('Unauthorized2')
        req.user = userIdentity
        next()
    }
    verifyJWT(token) {
        const [headerB64, payloadB64, signature] = token.split('.');

        const data = `${headerB64}.${payloadB64}`;
        const expectedSignature = crypto
            .createHmac('sha256', this.secretKey)
            .update(data)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        const payload = JSON.parse(this.base64urlDecode(payloadB64));
        const isValid = ((expectedSignature === signature) && (payload?.exp > Date.now() / 1000));
        return isValid ? payload : null;
    }
}

// const jwt = new JWT('hanzala')
// const secret = 'my-super-secret-kejy';

// const payload = {
//     sub: 'user123',
//     role: 'admin',
// };

// const token = jwt.createJWT(payload);
// console.log('JWT:', token);

// const verified = jwt.verifyJWT(token);
// console.log('Verified:', verified);