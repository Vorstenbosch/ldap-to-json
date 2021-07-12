require('dotenv').config()
const fs = require('fs')
const ldap = require('ldapjs')
const assert = require('assert')

var debug = false
var client

if (process.env.DEBUG == 'true') {
    debug = true
}

debug && console.debug(`server url: ${process.env.LDAP_SERVER_URL}`)

if (process.env.LDAP_SERVER_URL.startsWith('ldaps://')) {
    const tlsCert = fs.readFileSync(process.env.CA_CERT, 'utf8')
    client = ldap.createClient({
        url: [process.env.LDAP_SERVER_URL],
        tlsOptions: {ca: tlsCert}
    })
} else {
    client = ldap.createClient({
        url: [process.env.LDAP_SERVER_URL]
    })
}

client.on('error', (err) => {
    assert.ifError(err)
})

client.bind(process.env.LDAP_BIND_DN, process.env.LDAP_BIND_PWD, (err) => {
    assert.ifError(err)
})

const opts = {
    filter: process.env.SEARCH_FILTER,
    scope: 'sub',
    attributes: []
}

let searchResult = {}
searchResult.ldapServer = process.env.LDAP_SERVER_URL
searchResult.searchFilter = process.env.SEARCH_FILTER
searchResult.searchBase = process.env.SEARCH_BASE
searchResult.objectsFound = []

client.search(process.env.SEARCH_BASE, opts, (err, res) => {
    assert.ifError(err)

    res.on('searchRequest', (searchRequest) => {
        debug && console.debug('searchRequest: ', searchRequest.messageID)
    })

    res.on('searchEntry', (entry) => {
        debug && console.debug(`Found entry '${JSON.stringify(entry, null, 2)}'`)
        searchResult.objectsFound.push(entry)
    })

    res.on('searchReference', (referral) => {
        debug && console.debug('referral: ' + referral.uris.join())
    })

    res.on('error', (err) => {
        console.error('search error: ' + err.message)
    })

    res.on('end', (result) => {
        debug && console.debug('status: ' + result.status)

        let data = JSON.stringify(searchResult, null, 2)
        fs.writeFile('objectsFound.json', data, function (err) {
            assert.ifError(err)

            client.unbind((err) => {
                assert.ifError(err)
            })
        })
    })
})
