  $(document).ready(function() {
    if(isAPIAvailable()) {
      $('#files').bind('change', handleFileSelect);
    }
  });
  
    //TODO: make it dynamic 
    //move this to another file
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
    readFile(file);
    // post the results
    $('#panel').append(output);
  }

  function readFile(file){
    var SUB = 15;
    var LAT = 16;
    var LNG = 17;
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      var csv = event.target.result;
      var data = $.csv.toArrays(csv);
        for(var row in data) {
            if(row>0){ 
                if (data[row][LAT]!=undefined && data[row][LNG]!=undefined)
                {                
                    var store = new Store(parseFloat(data[row][LAT]),parseFloat(data[row][LNG]),0);
                    
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
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
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
  
  