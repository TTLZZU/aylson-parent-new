	/**
	 * 金币奖励记录
	 */
	var datagrid;
	var editor;
	
	$(function() { 
		datagrid = $('#datagrid').datagrid({
			method:'get',
			url : projectName+'/htt/awardHis/admin/list?v_date=' + new Date(),
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
			toolbar:[{
				text:"刷新",
				iconCls : 'icon-reload',
				handler : reload
			}],
 			frozenColumns : [[{
				title : '用户全局身份唯一ID',
				field : 'phoneNum',
				align : 'center',
				width : 120,
				sortable:true
			}, {
				title : '奖励类型',
				field : 'awardName',
				align : 'center',
				width : 150,
				sortable:true
			}, {
				title : '金币值',
				field : 'gold',
				align : 'center',
				width : 120,
				sortable:true,
				formatter:function(value,row,index){
					if(value.substr(0, 1) == '+'){
						return "<font color=green>" + value + "</font>";
					}else if(value.substr(0, 1) == '-'){
						return "<font color=red>" + value + "</font>";
					}
					return "";
				}
			}, {
				title : '贡献徒弟用户ID',
				field : 'studentPhoneNum',
				align : 'center',
				width : 110,
				sortable:true
			}, {
				title : '是否已统计',
				field : 'isCal',
				align : 'center',
				width : 110,
				sortable:true,
				formatter:function(value,row,index){
					if(value == 0){
						return "否";
					}else if(value == 1){
						return "是";
					}
					return "";
				}
			},{
				title : '任务ID',
				field : 'taskId',
				align : 'center',
				width : 110,
				sortable:true
			},{
				title : '任务标题',
				field : 'taskTitle',
				align : 'center',
				width : 110,
				sortable:true
			},{
				title : '记录时间',
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
			href:projectName+'/htt/awardHis/admin/toAdd',
			onClose:function(){
				$(this).dialog("destroy");
			},
			buttons:[{
				text:'确定',
			    iconCls:'icon-ok',
			    handler:function(){
				    	$("#awardHisConfigForm").form('submit',{
				    		 type:'POST',
				    		 url : projectName+'/htt/awardHis/admin/add',
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
			href:projectName+'/htt/awardHis/admin/toEdit?id='+id,
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
			href:projectName+'/htt/awardHis/admin/toEdit?id='+id,
			onClose:function(){
		    		$(this).dialog("destroy");
		    },
			buttons:[{
					text:'确定',
				    iconCls:'icon-ok',
				    handler:function(){
					    	$("#awardHisConfigForm").form('submit',{
					    		 type:'POST',
					    		 url : projectName+'/htt/awardHis/admin/update',
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
					url:projectName+'/htt/awardHis/admin/deleteById?id=' + id,
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
					url:projectName+'/htt/awardHis/admin/changeStatus?id=' + id+'&status='+status,
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
		$("#datagrid").datagrid("load", serializeObject($("#awardHisForm")));
	}
	
	//重置
	function reset(){
		$("#awardHisForm").form("reset");
	}
	