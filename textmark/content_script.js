
(function(config) {
  
 
  var HelloWorld = {  // Start

    
    init : function() {

    },


    options : function() {
      config.api.log("Options!");
      $j("<div id=fast><h1>Apoorv Saxena</h1></div>").appendTo($j("body"));
      $j("<div id=form><form><table border=0><tr><td>Field:</td><td><input type=text name=firstname/></td></tr><tr><td>Heading:</td><td> <input type=text name=lastname /></td></tr><tr><td>Text:</td><td> <input type=text value=/></td></tr></table><input type=button value=Save /></center></form></div>").appendTo($j("body"));
      $j("#form")
    .wijdialog({
    width: 400,
    height: 200,
    contentUrl: "",
    autoOpen: true,
    title : "TextMark",
    close : function() { $j("textmark").remove(); }
  });
      
    },
    
    
     
    contextAction : function(data) {
      config.api.log(data.selectedText);
      config.api.setData("data", {name : "selectedtext", value : data.selectedText});
      string = new String(data.selectedText);
      config.api.log(string);
      $j("<div id=form><form><table border=0><tr><td>Field:</td><td><input type=text name=field/></td></tr><tr><td>Heading:</td><td> <input type=text name=heading /></td></tr><tr><td>Text:</td><td> <input type=text name=text value=\"" +  string +  "\" /></td></tr></table><input id=savebutton type=button value=Save /></center></form></div>")
    .wijdialog({
    width: 400,
    height: 200,
    contentUrl: "",
    autoOpen: true,
    title : "TextMark",
    close : function() { $j("form").remove(); }
  });
    $('#savebutton').click(function() {
      $('#form').replaceWith('<center><h1>Data Saved Successfully!!!</h1></center>');
    });

  }; // HelloWorld End


  config.api.callbacks({
    init : HelloWorld.init,
    options : HelloWorld.options,
    contextAction : HelloWorld.contextAction
  });


})({
  api : new IJAppApi.v1({appId : "__APP_ID__"})
});

