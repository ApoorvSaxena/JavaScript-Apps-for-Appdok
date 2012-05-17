
(function(config) {
  
 
  var HelloWorld = {  

 
    contextAction : function(data) {

      var audio_url = "http://translate.google.com/translate_tts?q=" + data.selectedText;
      jQuery("<div/>", {id : "my-voice-message"})
      .appendTo($j("body"))
      .wijdialog({
      width: 400,
      height: 200,
      contentUrl: audio_url,
      autoOpen: true,
      title : "Listen",
      close : function() { $j("my-voice-message").remove(); }
      });

    }

  }; // HelloWorld End

  config.api.callbacks({
    init : HelloWorld.init,
    options : HelloWorld.options,
    contextAction : HelloWorld.contextAction
  });



})({
  api : new IJAppApi.v1({appId : "__APP_ID__"})
});

