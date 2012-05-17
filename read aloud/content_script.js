(function(config) {
  
  var TextToSpeech = {  // Start
    apiKey : "xQ8QigXrMg6ao2aAqFz5V8qB5qTdCu3MLWFmcvWN",  // Get API key from https://labs.ericsson.com/apis/text-to-speech/

    init : function() {
    },
    
    contextAction : function(data) {
      TextToSpeech.begin(data.selectedText);
    },

    begin : function(selectedText) {
      var audio_url = "http://tts.labs.ericsson.net/read?stattype=labs_webb&lang=en_us&voice=0&format=mp3&devkey=" + TextToSpeech.apiKey + "&text=" + encodeURIComponent(selectedText);

      var audioId = "my-voice-message-" + $j.now();
      $j("<div/>", {id : audioId, style : "overflow:hidden;"})
        .appendTo($j("body"))
        .wijdialog({
          width: 400,
          height: 200,
          contentUrl: audio_url,
          autoOpen: true,
          title : "Text to Speech",
          close : function() { $j("#" + audioId).remove(); }
        });
    }

  }; // TextToSpeech End



  config.api.callbacks({
    init : TextToSpeech.init,
    contextAction : TextToSpeech.contextAction
  });


})({
  api : new IJAppApi.v1({appId : "__APP_ID__"})
});

