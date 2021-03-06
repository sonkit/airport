Ext.define('security.view.dictionary.DictionaryManageWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.dictionarymgrwin',
    
    title: '维护字典',
    modal: true,
    constrainHeader: true,
    plain: true,
    bodyPadding: 1,
    closeAction: 'hide',
    width: 300,
    layout: 'fit',
    
    initComponent: function(arguments) {
        
        var me = this;
        var	dictionaryStore = Ext.create('Ext.data.Store', {
            fields: ['id','name'],
            proxy: {
                type: 'rest',
                url: 'dictionary/findByParentId/1'
            }
        });
        
        Ext.applyIf(me, {
            items: [{
                xtype: 'form',
                url: 'dictionaryManage',
                bodyPadding: 5,
                frame: true,
                fieldDefaults: {
                    labelWidth: 65,
                },
                defaults: {
                    xtype: 'textfield',
                    allowBlank: false,
                    anchor: '100%'
                },
                items: [{
                    fieldLabel: '字典名称',
                    name: 'name'
                },{
                    fieldLabel: '字典描述',
                    name: 'description'
                },{
                    xtype: 'combobox',
                    fieldLabel: '字典树',
                    name: 'dictionaryId',
                    valueField: 'id',
                    displayField: 'name',
                    editable: false,
                    store: dictionaryStore
                }]
            }],
            buttonAlign: 'center',
            buttons: [{
            	text: '保存',
                tooltip: '保存',
                icon: 'icons/accept.png'
            },{
            	text: '关闭',
                icon: 'icons/cancel.png',
				scope: this,
				handler: function() {
					this.hide();
				}
            }]
        });
        
        me.callParent(arguments);
    }
});
