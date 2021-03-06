Ext.define('security.controller.AuthorityController', {
    extend: 'Ext.app.Controller',
    stores: ['Authority'],
    views: [
        'authority.AuthorityManagerPanel',
        'authority.AuthorityForm',
        'authority.AuthorityWin'
    ],
    
    refs: [{
        ref: 'authorityTree',
        selector: 'authoritymgrpanel > authoritytree'
    },{
        ref: 'authorityForm',
        selector: 'authoritymgrpanel > authorityform'
    },{
        ref: 'authorityWin',
        selector: 'authoritywin'
    }],
    
    init: function() {
    	this.control({
    		'authoritymgrpanel > authoritytree': {
    			itemcontextmenu: this.onAuthorityTreeItemcontextmenu,
    			itemclick: this.onAuthorityItemclick
    		},
    		'authoritywin button[text="保存"]': {
                click: this.saveAuthority
            }
    	});
    },

    onAuthorityTreeItemcontextmenu: function(view, record, item, index, e, eOpts ) {
    	if(!this.contextmenu) {
			this.contextmenu = Ext.widget('menu', {
				width: 80,
				items:[{
					text: '添加资源',
					scope: this,
					icon: 'icons/book_add.png',
					handler: function(menuItem) {
						this.showAuthorityWin(menuItem, 'add');
					}
		        },'-',{
		        	text: '编辑资源',
		        	scope: this,
		        	icon: 'icons/book_edit.png',
					handler: function(menuItem) {
						this.showAuthorityWin(menuItem, 'update');
					}
		        },'-',{
		        	text: '删除资源',
		        	scope: this,
		        	icon: 'icons/book_delete.png',
					handler: function(menuItem) {
						this.deleteAuthority(menuItem);
					}
		        }]
		    });
		}
		e.preventDefault();
		this.contextmenu.showAt(e.getXY());
	},
    
    onAuthorityItemclick: function(view, record, item, index, e, eOpts ) {
		var form = this.getAuthorityForm();
		form.loadRecord(record);
	},
	
	showAuthorityWin: function(menuItem, option) {
		
		var node = this.getAuthorityTree().getSelectionModel().getLastSelected();
		
		if (!node.isExpanded()) {
			node.expand();
		}
		var win = this.getAuthorityWin();
		if(!win) {
			win = Ext.widget('authoritywin');
		}
		
		var f = win.child('form').getForm();
		
		if(option == 'add'){
			var record = Ext.create('security.model.Authority', {
				'parent': {id: node.get('id')},
				'parentName': node.get('name')
			});
			f.loadRecord(record);
		}else if(option == 'update'){
			node.set('parent', {id: node.parentNode.get('id')});
			node.set('parentName', node.parentNode.get('name'));
			f.loadRecord(node);
		}
	
		win.show(menuItem);
	},
	
	saveAuthority: function(btn) {          
        var win = this.getAuthorityWin(),
			f = win.child('form').getForm();
        if (f.isValid()) {
            f.updateRecord();
            var authority = f.getRecord();
            
            var selectedNode = this.getAuthorityTree().getSelectionModel().getLastSelected();
            authority.save({
                success: function() {
                    win.hide();
                }
            });
            var id = authority.get('id');
            if(id == ''){
            	if (selectedNode.isLeaf()) {
					selectedNode.set('leaf',false);
				}
            	Ext.Msg.alert('提示','新增成功!');
            	var store = this.getAuthorityStore();
            	store.load({
            		node: selectedNode
            	});
            }else{
                selectedNode.set('text', authority.get('name'));
                selectedNode.set('version', authority.get('version')+1);
            	Ext.Msg.alert('提示','更新成功!');
            }
            
        }
    },
    
	deleteAuthority: function(menuItem) {
		var selectedNode = this.getAuthorityTree().getSelectionModel().getLastSelected();
		if(selectedNode != null){
	        var isLeaf = selectedNode.isLeaf();
			if(isLeaf){
				Ext.Msg.show({
					title:'提示',
					msg: '确定删除节点?',
					buttons: Ext.Msg.YESNO,
					icon: Ext.Msg.QUESTION,
					fn: function(btn){
                        if(btn=='yes'){
                        	selectedNode.destroy({
                        		success: function() {
                        			if(selectedNode.parentNode.childNodes.length ==1 ){
                                		selectedNode.parentNode.set('leaf',true);
                                	}
                                }
                            });
				    	}
				    }
				});
			}else{
				Ext.Msg.alert('提示','请选择叶子节点删除!');
			}
		}else{
			Ext.Msg.alert('提示','请先选择一个节点!');
		}
    }

});
