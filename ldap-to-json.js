require('dotenv').config()
const ldap = require('ldapjs');

const client = ldap.createClient({
    url: [process.env.LDAP_SERVER_URL]
});

client.on('error', (err) => {
    assert.ifError(err)
})

client.bind(process.env.LDAP_BIND_DN, process.env.LDAP_BIND_PWD, (err) => {
    assert.ifError(err)
});

const opts = {
    filter: process.env.SEARCH_FILTER,
    scope: 'sub',
    attributes: []
};

client.search(env.process.SEARCH_BASE, opts, (err, res) => {
    assert.ifError(err);
    
    res.on('searchRequest', (searchRequest) => {
        console.log('searchRequest: ', searchRequest.messageID);
    });
    res.on('searchEntry', (entry) => {
        console.log('entry: ' + JSON.stringify(entry.object));
    });
    res.on('searchReference', (referral) => {
        console.log('referral: ' + referral.uris.join());
    });
    res.on('error', (err) => {
        console.error('error: ' + err.message);
    });
    res.on('end', (result) => {
        console.log('status: ' + result.status);
    });
});