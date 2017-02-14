var ldap = require('ldapjs');

var config = require('./config.js');
var filelist = require('./ldapfs.js');
var ldaputil = require('./exchangeldapobject.js');
var server = ldap.createServer();

var ADMIN_ID = config.ADMIN_ID;
var ADMIN_PASSWORD = config.ADMIN_PASSWORD;
var SUFFIX = config.SUFFIX;
var PORT = config.PORT;

var ldapobject = {};
ldapobject[SUFFIX] = {
    dn: SUFFIX,
    attributes: {
        objectclass: ['organization', 'top'],
        o: 'test1'
    }
};

ldaputil.getLdapobject(ldapobject, filelist.getlist(), SUFFIX);

//---------------------------
server.bind(ADMIN_ID, function(req, res, next) {
    if (req.dn.toString() !== ADMIN_ID || req.credentials !== ADMIN_PASSWORD)
        return next(new ldap.InvalidCredentialsError());

    res.end();
    return next();
});
server.bind(SUFFIX, function(req, res, next) {
    var dn = req.dn.toString();
    console.log('reqdn : %s', dn);
    if (!ldapobject[dn])
        return next(new ldap.NoSuchObjectError(dn));

    if (!ldapobject[dn].userpassword)
        return next(new ldap.NoSuchAttributeError('userPassword'));
    if (ldapobject[dn].userpassword !== req.credentials)
        return next(new ldap.InvalidCredentialsError());

    res.end();
    return next();
});

//----------------------------


server.search("", authorize, function(req, res, next) {
    var dn = req.dn.toString();
    console.log('LDAP server serch DSE= : %s', dn);


    var baseObject = {
        dn: '',
        structuralObjectClass: 'top',
        configContext: 'cn=config',
        attributes: {
            objectclass: ['top'],
            namingContexts: [SUFFIX],
            supportedLDAPVersion: ['3'],
            subschemaSubentry: ['cn=Subschema']
        }
    };

    if ('base' == req.scope &&
        '(objectclass=*)' == req.filter.toString() &&
        req.baseObject == '') {
        res.send(baseObject);
    }

    res.end();
    return next();
});

server.search('cn=Subschema', authorize, function(req, res, next) {
    var schema = {
        dn: 'cn=Subschema',
        attributes: {
            objectclass: ['top', 'subentry', 'subschema', 'extensibleObject'],
            cn: 'Subschema'
        }
    };
    res.send(schema);
    res.end();
    return next();
});

server.search('o=example', function(req, res, next) {
    var obj = {
        dn: req.dn.toString(),
        attributes: {
            objectclass: ['organization', 'top'],
            o: 'example'
        }
    };

    if (req.filter.matches(obj.attributes))
        res.send(obj);

    res.end();
});


server.search(SUFFIX, authorize, function(req, res, next) {
    var dn = req.dn.toString();

    console.log('[top]LDAP server serch dn= : %s', dn);

    if (!ldapobject[dn])
        return next(new ldap.NoSuchObjectError(dn));

    var scopeCheck;
    console.log('LDAP server serch scope= : %s', req.scope);


    switch (req.scope) {
        case 'base':
            res.send(ldapobject[dn]);

            res.end();
            return next();

        case 'one':
            scopeCheck = function(k) {
                if (req.dn.equals(k)) {
                    console.log('LDAP server search keyskipchek: %s', k);
                    return false;

                } else {
                    var parent = ldap.parseDN(k).parent();
                    console.log('LDAP server search keyone_k: %s', k);
                    console.log('LDAP server search keyone_kp: %s', parent);
                    console.log('LDAP server search keyone_kd: %s', req.dn);

                    return (parent ? parent.equals(req.dn) : false);
                }
            };
            break;

        case 'sub':
            scopeCheck = function(k) {
                return (req.dn.equals(k) || req.dn.parentOf(k));
            };

            break;
    }

    Object.keys(ldapobject).forEach(function(key) {
        console.log('LDAP server search filter %s', req.filter.toString());

        console.log('LDAP server search object: %s', key);

        if (!scopeCheck(key)) {
            console.log('LDAP server search keyskipy: %s', key);

        } else {
            console.log('LDAP server search keyx: %s', key);

            if (req.filter.matches(ldapobject[key].attributes)) {
                console.log('LDAP server search key_find: %s', key);
                res.send(ldapobject[key]);
            }
        }
        // return ;
    });

    res.end();
    return next();
});

//-------------

function authorize(req, res, next) {
    if (req.connection.ldap.bindDN.equals(req.dn.toString()))
        return next();

    if (!req.connection.ldap.bindDN.equals('cn=root'))
        return next(new ldap.InsufficientAccessRightsError());

    return next();
}

//------------------------
//fire up

server.listen(PORT, function() {
    console.log('LDAP server listening at %s', server.url);
    console.log('LDAP server object %s', Object.keys(ldapobject).length);
});
