$(document).ready(function(){



});

$(document).on("formloaded", function(event){

	/*//console.log("formloaded");
	//console.log($("form"));
	$("form").each(function(){
		
		console.log($(this));
		//$(this).
	

	});*/
	
});



/*$(document).on('change', 'select', function() {
    //console.log($(this).attr("data-stepid"))
});

$(document).on('change', 'input', function() {
    //console.log($(this).attr("data-stepid"))
    data={}
    data["stepid"]=$(this).attr("data-stepid")
    data["index"]=$(this).attr("data-index")
    data["value"]=$(this).val()

});*/

function userAction(action)
{
	primaryForm=$("form")

	if($(primaryForm).length>0)
	{
		validationResult=$("form").valid();
		if(!validationResult)
		{
			return 0
		}
	}

	var stepID=null;
	fieldCount=$("#fieldCount").val()
	fieldCount=parseInt(fieldCount)
	fieldData=[];

	for(index=0;index<fieldCount;index++)
	{
		fieldValue=$("#"+index).val()
		stepID=$("#"+index).attr("data-stepid")
		if(!fieldValue)
		{
			fieldValue=null
		}

		fieldData.push(fieldValue)

	}
	//console.log(fieldData)
	params=getParams(window.location.href)
	flowID=params.id
	//console.log(flowID)
	//console.log(stepID)

	//Save the Data to the Specific Step
	approvedData={}
	approvedData["fieldValues"]=fieldData
	approvedData["action"]=action
	//approvedData["action"]="approved"
	approvedData["by"]=getLoggedInUserObject()// common.js
	approvedData["timestamp"]=Date.now();
	
	if(stepID===null)
	{
		stepID=$("#activestepid").val()
		//console.log(stepID)
	}
	//console.log($("form").attr("data-stepid"))
	//console.log($("form"))
	//return
	commenttext=$("#new_comment_input").val()
	commenttext=commenttext.trim()
	console.log(commenttext)
	if(commenttext!=="")
	{
		console.log("adding a comment")
		commentmeta={}
		commentmeta["by"]=getLoggedInUserObject()// common.js
		commentmeta["timestamp"]=Date.now();
		commentmeta["comment"]=commenttext
		db.collection("Workflows")
		.doc(flowID)
		.collection("comments")
		.doc()
		.set(commentmeta)

	}

	flowMeta={}
	flowMeta["ready"]=false
	db.collection("Workflows")
		.doc(flowID)
		.update(flowMeta)
	
	db.collection("Workflows")
		.doc(flowID)
		.collection("steps")
		.doc(stepID)
		.update(approvedData)
		
}



