# ldap-to-json
Tiny converter script from ldap to json.

## Config
The ldap-to-json script requires a `.env` file in the directory it is being ran from. You need to take care of the following variables:

|Variable|Description|
|---|---|
|LDAP_SERVER_URL|The url to the LDAP server, e.g. `ldap(s)://your-ldap.server`|
|LDAP_BIND_DN|The DN used to bind with|
|LDAP_BIND_PWD|The passwsord used to bind with|
|SEARCH_FILTER|The LDAP filter used to search the LDAP server|
|SEARCH_BASE|The base from which the searching should commence|
|DEBUG|Enables debug messages when set to `true`|
|CA_CERT|CA to trust (only when using LDAPS)|

## Testing with LDAP
To quickly test against a live LDAP you can use the following snippets.

```bash
docker run --env LDAP_TLS_VERIFY_CLIENT=try --hostname openldap.localtest.me -p 389:389 -p 636:636 --name my-openldap-container --detach osixia/openldap:1.5.0
```

Using the following `.env` file:
```bash
LDAP_SERVER_URL=ldap://localhost:389
LDAP_BIND_DN=cn=admin,dc=example,dc=org
LDAP_BIND_PWD=admin
SEARCH_FILTER=(uid=*)
SEARCH_BASE=dc=example,dc=org
```
