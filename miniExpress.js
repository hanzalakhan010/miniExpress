import http from 'http'
import { notFound } from './defaults.js';
import { handleQueryParams } from './utils.js';
import { renderStatic } from './utils.js';

export class Router {
    constructor() {
        this.middlewares = []
        this.routes = {
            "GET": {}, "POST": {}, 'PATCH': {}, 'DELETE': {}
        }
        this.dynamicRoutes = {
            "GET": {}, "POST": {}, 'PATCH': {}, 'DELETE': {}
        }
    }
    get(route, ...callbacks) {
        if (route.includes(':')) {
            this.dynamicRoutes['GET'][route] = [...this.middlewares, ...callbacks];
        }
        else {
            this.routes['GET'][route] = [...this.middlewares, ...callbacks];
        }
    }
    post(route, ...callbacks) {
        this.routes['POST'][route] = [...this.middlewares, ...callbacks];
    }
    patch(route, callback) {
        this.routes['PATCH'][route] = callback;
    }
}
export default class MiniExpress extends Router {
    constructor() {
        super()
        this.staticFolder = ''
    }

    register(route, routePool) {
        for (let method in routePool.routes) {
            for (let endpoint in routePool.routes[method]) {
                this[method.toLowerCase()](`${route}${endpoint}`, ...routePool.routes[method][endpoint])
            }
        }
        for (let method in routePool.dynamicRoutes) {
            for (let endpoint in routePool.dynamicRoutes[method]) {
                this[method.toLowerCase()](`${route}${endpoint}`, ...routePool.dynamicRoutes[method][endpoint])
            }
        }

    }
    use(...args) {
        if (typeof args[0] === 'string') {
            this.register(args[0], args?.[1])
        }
        else {
            this.middlewares.push(...args)
        }
        // console.log(this.dynamicRoutes)
    }
    redirect(res, location) {
        res.writeHead(302, { Location: location })
        return res.end()
    }
    async handleForm(req) {
        return new Promise((resolve, reject) => {
            let body = ''
            req.on('data', chunk => body += chunk)
            req.on('end', () => {
                req.form = body
                body = handleQueryParams(body)
                resolve(body)
            })
            req.on('error', error => reject(error))
        })
    }
    listen(port, callback) {
        http.createServer((req, res) => {
            this.routeHandler(req, res)
        }).listen(port, callback)
    }
    handleDynamicRoute(path, method, req) {
        let methodRoutes = this.dynamicRoutes?.[method]
        const pathSegemts = path.split('/')
        for (var route in methodRoutes) {
            let patternSegments = route.split('/')
            if (patternSegments.length !== pathSegemts.length) continue
            var params = ''
            for (let index = 0; index < pathSegemts.length; index++) {
                if (patternSegments[index].startsWith(':')) {
                    params += `${patternSegments[index].substring(1)}=${pathSegemts[index]}&`
                } else if (patternSegments[index] !== pathSegemts[index]) break
                if (index == patternSegments.length - 1) {
                    req.params = handleQueryParams(params)
                    return methodRoutes[route]
                }
            }
        }
        return null
    }

    serveStatic(req, res) {
        return renderStatic(`./templates/${req.url}`, res)
    }
    routeHandler(req, res) {
        if (this.staticFolder && req.url.startsWith(this.staticFolder)) {
            return res.end(this.serveStatic(req, res))
        }
        let [path, queryparams] = req.url.split('?')
        if (queryparams) handleQueryParams(queryparams, req)
        // const callbacks = this.routes?.[req.method]?.[path]
        const callbacks = this.routes?.[req.method]?.[path] ?? this.handleDynamicRoute(path, req.method, req)
        if (callbacks) {
            for (let callback of callbacks) {
                if (callback(req, res)) break
            }
            return
        }
        else {
            return res.end(notFound(res))
        }
    }
}




