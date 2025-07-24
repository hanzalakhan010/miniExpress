import fs from 'fs'

export function logger(req, res) {
    // console.log(`${new Date().toISOString()} : ${req.url} : ${req.method} `)
    fs.appendFile('app.log', `${req.url} : ${req.method} : ${new Date().toISOString()}\n`,()=>{})
}