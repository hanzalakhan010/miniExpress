import crypto from 'crypto'
import { handleQueryParams } from "./utils.js"
export default class SWT {
    constructor(secretKey) {
        this.secretKey = secretKey
    }
    encode(input) {
        return Object.entries(input).map(entry => `${entry?.[0]}=${encodeURIComponent(entry?.[1])}`).join('&')

    }
    decode(input) {
        return handleQueryParams(input)
    }
    createSWT(claims) {
        const basicClaims = {
            ExpiresOn: Math.floor(Date.now() / 1000) + 3600, // +1 hour
            ...claims,
        }
        const hmac = crypto.createHmac('sha256', this.secretKey)
        hmac.update(this.encode(basicClaims))
        const signature = hmac.digest('base64')
        basicClaims['HMACSHA256'] = signature
        return this.encode(basicClaims)
    }
    validateSWT(token) {
        const decodedToken = this.decode(token)
        // console.log(decodedToken)

        const signature = decodedToken?.HMACSHA256
        if (!signature) return false

        delete decodedToken?.HMACSHA256
        const expectedSignature = crypto.createHmac('sha256', this.secretKey)
            .update(this.encode(decodedToken))
            .digest('base64')
        // console.log(expectedSignature)
        if (expectedSignature == signature) return true
    }


}



const swt = new SWT('hanzalaKhan')

let obj = {
    name: 'hanzala',
    age: 19,
    addr: 'Karachi'
}
let token = swt.createSWT(obj)
console.log(token)
// console.log(swt.decode("name=hanzala&age=19&addr=Karachi"))
console.log(swt.validateSWT(token))