$(document).ready(function(){

    

});


/*
$(document).on('change', '#process_selector', function() {
    selectedProcess=$(this).val()
    if (selectedProcess==="-1")
    {
        return 0
    }
    
    
    
 


});*/

$(document).on("authready", function(){

    fetchDataForProcess("CurriculumWorkflow")
})

$(document).on("fieldsready", function(event){

    createFilterUI(filterFields);
    
});

filterFields=[]
async function fetchDataForProcess(processName)
{
    filterFields=[]
    $("#stepList").removeClass("standout");
    $("#stepList").empty()
    stepsList= await db.collection(processName)                        
                        .orderBy("index").get()
    //console.log(processName)
    processSteps=[]
   // console.log(stepsList)
    stepsList.forEach((doc)=>{
        processSteps.push(doc)
        //console.log(doc.data())
        collectSearchFields(doc.data());
    })

    $(document).trigger("fieldsready")

   
    

}


function collectSearchFields(processStep)
{
    //filterFields=[]
    //console.log(processSteps)
   // stepCount=processSteps.length
    
    if(!("fields" in processStep))
    {
        return;
    }
    fields=processStep["fields"];
    fieldCount=fields.length
    //console.log(fields)
    for(fieldIndex=0;fieldIndex<fieldCount;fieldIndex++)
    {
        fieldMeta=fields[fieldIndex]
        if(!("isSearchTerm" in fieldMeta))
        {
            continue;
        }
        isSearchTerm=fieldMeta["isSearchTerm"]
        if(isSearchTerm)
        {
         filterFields.push(fieldMeta)
        }

   }

   
  
}

function createFilterUI(fieldList)
{
    fieldCount=fieldList.length   
    for(index=0;index<fieldCount;index++)
    {
        createField(fieldList[index], index)
    }
    $("#buttonsection").removeClass("invisible")
}


async function searchWorkflows()
{
    fieldList=filterFields;
    fieldCount=fieldList.length 
    executeQuery=false
    let query = db.collection("Workflows");
   
    for(index=0;index<fieldCount;index++)
    {
        //createField(fieldList[index], index)
        fieldLabel=fieldList[index]["label"]
        fieldValue=$("#"+index).val()
        if(fieldValue && fieldValue!=="")
        {
          executeQuery=true
         // console.log(fieldLabel)
         // console.log(fieldValue)
          query = query.where(fieldLabel, '==', fieldValue);  
        }
        
    }

    if(executeQuery)
    {
        console.log("executing")
        results=await query.get()
        searchResultsCount=results.size
        //console.log(results[0])
        $("tr.row-data").remove()
        if(searchResultsCount>0)
        {
            
        }
        results.forEach((doc)=>{
            addRow(doc)

        })
        
    }
}

function addRow(doc)
{
    doc_data=doc.data()
    console.log(doc_data)
    row=$("<tr/>").attr("class", "row-data");
    curriculum=doc_data["Curriculum"]
    version=doc_data["Version"]
    classnumber=doc_data["Class"]
    asset=doc_data["Asset Type"]
    currentstep=doc_data["active_step_name"]

    dataKey=curriculum+"-"+version+"-"+classnumber
    $(row).append($("<td/>").text(dataKey))
    $(row).append($("<td/>").text(asset))
    $(row).append($("<td/>").text(currentstep))

    console.log(dataKey)
    $("#resultstable").append($(row))
}











function createField(fieldMeta, index)
{
    type=fieldMeta["type"]
    label=fieldMeta["label"]
    
    $("#filterFields").append(
                $('<div/>')
                .attr("class", "grid_4 fieldlabel")
                .append(label)
            )

    
    if(type=="dropdown")
    {
        
        div=$('<div/>').attr("class", "grid_6 field")

        options=fieldMeta["options"];
       
        
        dd=$("<select/>")
                .attr("data-index", index)
                .attr("id", index)
                .attr("name", index)
              
        $(dd).append($("<option/>"))
        for(index=0;index<options.length;index++)
        {
            option=$("<option/>").val(options[index]).text(options[index])
            
            $(dd).append($(option))
        }
        $("#filterFields").append($(div).append($(dd)))

        //Create a div to go to next line.
        

    }

    if(type==="range")
    {
        
        div=$('<div/>').attr("class", "grid_6 field")       
       
        
        dd=$("<select/>")                
                .attr("data-index", index)
                .attr("id", index)
                .attr("name", index)
             
        $(dd).append($("<option/>"))
        min=fieldMeta["min"];
        max=fieldMeta["max"];
        //console.log(min)
       // console.log(max)
        for(index=min;index<max+1;index++)
        {
            
            //console.log(index)
            option=$("<option/>").val(index).text(index)
           
            $(dd).append($(option))
        }
        $("#filterFields").append($(div).append($(dd)))

        //Create a div to go to next line.
        

    }
    
     $("#filterFields").append($('<div/>').attr("class", "clear"))
}

