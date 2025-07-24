export function notFound(res) {
    res.writeHead(404)
    return 'Page not found'
}
export function methodNotAllowed() {
    return 'Page not found'
}