	/**
	 * 邀请徒弟明细记录
	 */
	var datagrid;
	var editor;
	
	$(function() { 
		datagrid = $('#datagrid').datagrid({
			method:'get',
			url : projectName+'/htt/inviteUserHis/admin/list?v_date=' + new Date(),
			pagination : true,
			pageSize : 20,
			pageList : [ 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 ],
			fit : true,
			fitColumns : false,
			nowrap : false,
			border : false,
			idField : 'id',
			singleSelect:true,
			rownumbers: true,
			toolbar:[],
 			frozenColumns : [[{
				title : '师傅全局身份唯一ID',
				field : 'masterPhoneNum',
				align : 'center',
				width : 140,
				sortable:true
			}, {
				title : '师傅注册IP',
				field : 'masterRegisterIp',
				align : 'center',
				width : 90,
				sortable:true
			}, {
				title : '师傅IMEI码',
				field : 'masterImei',
				align : 'center',
				width : 110,
				sortable:true
			}, {
				title : '徒弟全局身份唯一ID',
				field : 'studentPhoneNum',
				align : 'center',
				width : 140,
				sortable:true
			}, {
				title : '徒弟注册IP',
				field : 'studentRegisterIp',
				align : 'center',
				width : 90,
				sortable:true
			}, {
				title : '徒弟IMEI码',
				field : 'studentImei',
				align : 'center',
				width : 110,
				sortable:true
			}, {
				title : '徒弟短信码',
				field : 'studentMsgCode',
				align : 'center',
				width : 80,
				sortable:true
			},{
				title : '各徒弟贡献总收益金币',
				field : 'studentsGold',
				align : 'center',
				width : 130,
				sortable:true
			}, {
				title : '注册类型',
				field : 'registerType',
				align : 'center',
				width : 140,
				sortable:true,
				formatter:function(value,row,index){
					if(value == 1){
						return "直接邀请码注册";
					}else if(value == 2){
						return "登录后再绑定";
					}else if(value == 3){
						return "通过IP绑定";
					}
					return "";
				}
			}, {
				title : '邀请时间',
				field : 'createDate',
				align : 'center',
				width : 120,
				sortable:true,
				formatter:function(value,row,index){
					if(value){
						return value.substring(0,19);
					}
					return value;
				}
			}
			] ]
		});
		
	});
	
	//新增
	function add(obj){
		var win;
		win = $("<div></div>").dialog({
			title:'新增',
			width:450,
			height:'50%',
			modal:true,
			href:projectName+'/htt/inviteUserHis/admin/toAdd',
			onClose:function(){
				$(this).dialog("destroy");
			},
			buttons:[{
				text:'确定',
			    iconCls:'icon-ok',
			    handler:function(){
				    	$("#inviteUserHisConfigForm").form('submit',{
				    		 type:'POST',
				    		 url : projectName+'/htt/inviteUserHis/admin/add',
				    		 success:function(responseData){
				    			 if(responseData){
				    				var data = $.parseJSON(responseData);
				    			 	$.messager.show({"title":"系统提示","msg":data.message,"timeout":1000});
				    			 	if(data.success){
										$("#datagrid").datagrid("reload");
										win.dialog('destroy');
				    				}
				    			 } 
				    		 }
				    	 });
			    }   
			   },{
				 text:'取消',
			     iconCls:'icon-cancel',  
			 	 handler:function(){
			 		 win.dialog('destroy');
			 	 }   
			  }]
		});
	}
	
	//查看
	function query(id){
		win = $("<div></div>").dialog({
			title:'查看',
			width:450,
			height:'50%',
			maximizable:true,
			modal:true,
			href:projectName+'/htt/inviteUserHis/admin/toEdit?id='+id,
			onClose:function(){
		    		$(this).dialog("destroy");
		    },
			buttons:[{
					 text:'取消',
				     iconCls:'icon-cancel',  
				 	 handler:function(){
				 		 win.dialog('destroy');
				 	 }   
				  }]
		});
	}
	
	//修改
	function edit(id){
		win = $("<div></div>").dialog({
			title:'修改',
			width:450,
			height:'50%',
			maximizable:true,
			modal:true,
			href:projectName+'/htt/inviteUserHis/admin/toEdit?id='+id,
			onClose:function(){
		    		$(this).dialog("destroy");
		    },
			buttons:[{
					text:'确定',
				    iconCls:'icon-ok',
				    handler:function(){
					    	$("#inviteUserHisConfigForm").form('submit',{
					    		 type:'POST',
					    		 url : projectName+'/htt/inviteUserHis/admin/update',
					    		 success:function(responseData){
					    			 win.dialog('destroy');
					    			 if(responseData){
					    				var data = $.parseJSON(responseData);
					    			 	$.messager.show({"title":"系统提示","msg":data.message,"timeout":1000});
					    			 	if(data.success){
					    			 		$("#datagrid").datagrid("reload");
					    				}
					    			 } 
					    		 }
					    	 });
				     }   
				   },{
					 text:'取消',
				     iconCls:'icon-cancel',  
				 	 handler:function(){
				 		 win.dialog('destroy');
				 	 }   
				  }]
		});
	}

	//删除
	function del(id){
		$.messager.confirm("提示","确定删除此记录吗？",function(r){
			if(r){
				$.ajax({
					type:"POST",
					url:projectName+'/htt/inviteUserHis/admin/deleteById?id=' + id,
					dataType:"json",
					success:function(data){
						if(data){
		    				$.messager.show({"title":"系统提示","msg":data.message,"timeout":1000});
		    				if(data.success){
		    					$("#datagrid").datagrid("reload");
		    				}
		    			 }
					}
				});
			}
		});
	}
	
	//发布
	function changeStatus(id, status){
		var tip = "";
		if(status == 1){
			tip = "确定下线吗？";
			
		}else if(status == 2){
			tip = "确定上线吗？";
		}
		$.messager.confirm("提示",tip,function(r){
			if(r){
				$.ajax({
					type:"POST",
					url:projectName+'/htt/inviteUserHis/admin/changeStatus?id=' + id+'&status='+status,
					dataType:"json",
					success:function(data){
						if(data){
		    					$.messager.show({"title":"系统提示","msg":data.message,"timeout":1000});
			    				if(data.success){
			    					$("#datagrid").datagrid("reload");
			    				}
		    			 	}
					}
				});
			}
		});
	}
	
	//刷新
	function reload(){
		$("#datagrid").datagrid("reload");
	}
	
	//搜索
	function doSearch(){
		$("#datagrid").datagrid("load", serializeObject($("#inviteUserHisForm")));
	}
	
	//重置
	function reset(){
		$("#inviteUserHisForm").form("reset");
	}
	