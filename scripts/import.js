  $(document).ready(function() {
    if(isAPIAvailable()) {
      $('#files').bind('change', handleFileSelect);
    }
  });
  
    //TODO: make it dynamic 
    //move this to another file
    
   //sub-networks  
  $('#sub_id0').live('change', function(){
    if($(this).is(':checked')){
        addMarkers(0);
    } else {
        removeMarkers(0);
    }
});

  $('#sub_id1').live('change', function(){
    if($(this).is(':checked')){
        addMarkers(1);
    } else {
        removeMarkers(1);
    }
});

  $('#sub_id2').live('change', function(){
    if($(this).is(':checked')){
        addMarkers(2);
    } else {
        removeMarkers(2);
    }
});

  $('#sub_id3').live('change', function(){
    if($(this).is(':checked')){
        addMarkers(3);
    } else {
        removeMarkers(3);
    }
});

  $('#sub_id4').live('change', function(){
    if($(this).is(':checked')){
        addMarkers(4);
    } else {
        removeMarkers(4);
    }
});

  $('#sub_id5').live('change', function(){
    if($(this).is(':checked')){
        addMarkers(5);
    } else {
        removeMarkers(5);
    }
});

  $('#sub_id6').live('change', function(){
    if($(this).is(':checked')){
        addMarkers(6);
    } else {
        removeMarkers(6);
    }
});

  $('#sub_id7').live('change', function(){
    if($(this).is(':checked')){
        addMarkers(7);
    } else {
        removeMarkers(7);
    }
});

  $('#sub_id8').live('change', function(){
    if($(this).is(':checked')){
        addMarkers(8);
    } else {
        removeMarkers(8);
    }
});

  $('#sub_id9').live('change', function(){
    if($(this).is(':checked')){
        addMarkers(9);
    } else {
        removeMarkers(9);
    }
});
   //commodity
  $('#ch_cmd_0').live('change', function(){
    if($(this).is(':checked')){
        w_ambient=1;
    } else {
        w_ambient=0;
    }
    updateWeights();
});

  $('#ch_cmd_1').live('change', function(){
    if($(this).is(':checked')){
        w_frozen =1;
    } else {
        w_frozen=0;
    }
    updateWeights();
});

  $('#ch_cmd_2').live('change', function(){
    if($(this).is(':checked')){
        w_perishable=1;
    } else {
        w_perishable=0;
    }
    updateWeights();
});

    //weekdays
     $('#ch_day_0').live('change', function(){
    if($(this).is(':checked')){
        sun=1;
    } else {
        sun=0;
    }
    updateWeights();
});
     $('#ch_day_1').live('change', function(){
    if($(this).is(':checked')){
        mon=1;
    } else {
        mon=0;
    }
    updateWeights();
});
     $('#ch_day_2').live('change', function(){
    if($(this).is(':checked')){
        tue=1;
    } else {
        tue=0;
    }
    updateWeights();
});
     $('#ch_day_3').live('change', function(){
    if($(this).is(':checked')){
        wed=1;
    } else {
        wed=0;
    }
    updateWeights();
});
     $('#ch_day_4').live('change', function(){
    if($(this).is(':checked')){
        thu=1;
    } else {
        thu=0;
    }
    updateWeights();
});
     $('#ch_day_5').live('change', function(){
    if($(this).is(':checked')){
        fri=1;
    } else {
        fri=0;
    }
    updateWeights();
});
     $('#ch_day_6').live('change', function(){
    if($(this).is(':checked')){
        sat=1;
    } else {
        sat=0;
    }
    updateWeights();
});

  function isAPIAvailable() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
      return true;
    } else {
      // source: File API availability - http://caniuse.com/#feat=fileapi
      // source: <output> availability - http://html5doctor.com/the-output-element/
      document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
      // 6.0 File API & 13.0 <output>
      document.writeln(' - Google Chrome: 13.0 or later<br />');
      // 3.6 File API & 6.0 <output>
      document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
      // 10.0 File API & 10.0 <output>
      document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
      // ? File API & 5.1 <output>
      document.writeln(' - Safari: Not supported<br />');
      // ? File API & 9.2 <output>
      document.writeln(' - Opera: Not supported');
      return false;
    }
  }

  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];

    // read the file metadata
    var output = ''
        output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
        output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
        output += ' - FileSize: ' + file.size + ' bytes<br />\n';
        output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';

    // read the file contents
    if(!imp1){
        readFile1(file);
        imp1 = true;
    }
    else {
        readFile2(file);
    }
    
    // post the results
    document.getElementById("panel").innerHTML = output;
  }

  function readFile1(file){
    //******configure file1 columns*****
    var SUB = 15;
    var LAT = 16;
    var LNG = 17;
    var EXT = 2;
    //***********************
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      var csv = event.target.result;
      var data = $.csv.toArrays(csv);
        for(var row in data) {
            if(row>0){ 
                if (data[row][LAT]!=undefined && data[row][LNG]!=undefined)
                {                
                    var store = new Store(parseFloat(data[row][LAT]),parseFloat(data[row][LNG]),0,0,1);
                    
                    if(data[row][EXT]!=undefined ){
                        store.setExt(data[row][EXT]);
                        var total_w = new Tot_weight(data[row][EXT],1);  
                        tot_weights.push(total_w);
                    }   
                    
                    if(data[row][SUB]!=undefined ){
                        //search the array (only add new sub networks)
                        if(subs.indexOf(data[row][SUB])==-1){
                        subs.push(data[row][SUB]);
                        }
                    store.setSub(subs.indexOf(data[row][SUB]));
                    }                 
                    imported.push(store);
                    stores.push(null);
                    markers.push(null);
                }                
            }
        }
            var title=document.createTextNode("Sub-networks");   
            document.getElementById("panel1").appendChild(title);
            for (x in subs){
                var node = document.createElement("DIV");
                node.id = 'sub_name' + x;
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.value = x;
                checkbox.id = 'sub_id'+ x;
                var textnode=document.createTextNode(subs[x]); 
                document.getElementById("panel3").appendChild(node);
                node.appendChild(checkbox);
                node.appendChild(textnode); 
                document.getElementById('panel3').style.marginBottom = '10px';
            };
        alert(row+' stores imported!');
        //set the import button for the second import.
        setFile2();
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
  }
  
  function readFile2(file){
    //******configure file2 columns*****
    var WT_A_1 = 2;
    var WT_A_2 = 3;
    var WT_A_3 = 4;
    var WT_A_4 = 5;
    var WT_A_5 = 6;
    var WT_A_6 = 7;
    var WT_A_7 = 8;
    
    var WT_F_1 = 9;
    var WT_F_2 = 10;
    var WT_F_3 = 11;
    var WT_F_4 = 12;
    var WT_F_5 = 13;
    var WT_F_6 = 14;
    var WT_F_7 = 15;
    
    var WT_P_1 = 16;
    var WT_P_2 = 17;
    var WT_P_3 = 18;
    var WT_P_4 = 19;
    var WT_P_5 = 20;
    var WT_P_6 = 21;
    var WT_P_7 = 22;
    var EXT = 1;
    //***********************
    var count;
    tot_weights = [];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      count =0;
      var csv = event.target.result;
      var data = $.csv.toArrays(csv);
        for(var row in data) {
            if(row>0){ 
                if (data[row][EXT]!=undefined)
                {   var weight = new Weight(data[row][EXT],parseFloat(data[row][WT_A_1]),parseFloat(data[row][WT_A_2]),parseFloat(data[row][WT_A_3]),parseFloat(data[row][WT_A_4]),
                                            parseFloat(data[row][WT_A_5]),parseFloat(data[row][WT_A_6]),parseFloat(data[row][WT_A_7]),parseFloat(data[row][WT_F_1]),parseFloat(data[row][WT_F_2]),
                                            parseFloat(data[row][WT_F_3]),parseFloat(data[row][WT_F_4]),parseFloat(data[row][WT_F_5]),parseFloat(data[row][WT_F_6]),parseFloat(data[row][WT_F_7]),
                                            parseFloat(data[row][WT_P_1]),parseFloat(data[row][WT_P_2]),parseFloat(data[row][WT_P_3]),parseFloat(data[row][WT_P_4]),parseFloat(data[row][WT_P_5]),
                                            parseFloat(data[row][WT_P_6]),parseFloat(data[row][WT_P_7]));
                    var total_w = new Tot_weight(data[row][EXT],0);
                    weights.push(weight);   
                    tot_weights.push(total_w);
                    count ++;                    
                }                
            }
        }
        alert(count+' rows of data imported!');
        var div = document.getElementById("imp_2");
        var parent = document.getElementById("inputs");
        if (div!=null){
            parent.removeChild(div);
        }
        setWeightUI();
        normalizeWeights();
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
  }
  
  function setFile2(){
      var div = document.getElementById("imp_1");
      var parent = document.getElementById("inputs");
      if (div!=null){
        var import2 = document.createElement("BUTTON");
        import2.id = "imp_2";
        import2.innerHTML = "import 2";
        import2.className = "import-button";
        import2.onclick = function(){
            document.getElementById('files').click();
        };
        parent.removeChild(div);
        parent.appendChild(import2); 
      }
  }
  

  function printTable(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      var csv = event.target.result;
      var data = $.csv.toArrays(csv);
      var html = '';
      for(var row in data) {
        html += '<tr>\r\n';
        for(var item in data[row]) {
          html += '<td>' + data[row][item] + '</td>\r\n';
        }
        html += '</tr>\r\n';
      }
      $('#panel2').html(html);
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
  }
  
  