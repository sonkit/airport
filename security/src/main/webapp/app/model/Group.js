Ext.define('security.model.Group', {
    extend: 'Ext.data.TreeModel',

    fields: [{
        name: 'id',
        type: 'int'
    },{
        name: 'name',
        type: 'string'
    },{
        name: 'text',
        type: 'string'
    },{
        name: 'parent'
    },{
        name: 'enabled',
        type: 'boolean'
    },{
        name: 'version',
        type: 'int'
    }],
    proxy: {
        type: 'rest',
        url: 'groups'
    }
});
