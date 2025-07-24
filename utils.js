import { readFileSync } from 'fs'
import crypto from 'crypto'
import path from 'path'
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.txt': 'text/plain',
};

export function handleQueryParams(queryparams, req) {
    let parameters = {}

    if (!queryparams) return parameters

    let params = queryparams.split('&')
    params.forEach(param => {
        let [rawKey, rawValue = ''] = param.split('=')
        if (rawKey) {

            const key = decodeURIComponent(rawKey)
            let value = decodeURIComponent(rawValue)

            // Try to cast to correct type
            if (value === 'true') {
                value = true
            } else if (value === 'false') {
                value = false
            } else if (/^-?\d+$/.test(value)) {
                value = parseInt(value, 10)
            }
            // else: leave it as string (e.g. password, email, etc.)

            parameters[key] = value
        }
    })

    if (req) req.query = parameters
    return parameters
}


export function renderTemplate(template, res, data = {}) {
    res.setHeader('Content-type', 'text/html')
    let renderedTemplate = readFileSync(`./templates/${template}`, 'utf8')
    renderedTemplate = renderedTemplate.replace(/{{([\s\S]+?)}}/g, (_, key) => {
        key = key.trim()
        return data[key] ?? ''

    })
    return renderedTemplate
}
export function handleURL(url, req) {
    const segments = url
}
export function renderStatic(file, res) {
    try {
        let ext = path.extname(file)
        let mimeType = mimeTypes?.[ext]
        res.setHeader('Content-type', mimeType)
        return readFileSync(file, 'utf8')
    }
    catch (err) {
        if (err.code == 'ENOENT') {
            console.error(`File not found: ${file}`);
            return 'File not found'
        }
        throw err

    }
}
