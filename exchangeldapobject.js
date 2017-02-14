function getLdapobject(ldapobj,orgObject, addDN) {

    for (var i = 0; i < orgObject.length; i++) {
        ldapobj['cn=' + orgObject[i].name + ',' + addDN ] = {
            dn: 'cn=' + orgObject[i].name + ',' + addDN ,
            attributes: {
                objectclass: ['inetOrgPerson', 'Person', 'organizationalPerson', 'Top'],
                cn: orgObject[i].name
            },
            userpassword: orgObject[i].userpassword
        };
    }
}
module.exports.getLdapobject = getLdapobject;
