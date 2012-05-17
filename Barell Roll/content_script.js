(function(config) {
  
  var BarellRoll = {  // Start
    
    options : function() {
      BarellRoll.roll();
    },

    roll : function() {
        var s = document.createElement('style');
        s.innerHTML="@-moz-keyframes roll { 100% { -moz-transform: rotate(360deg); } } @-o-keyframes roll { 100% { -o-transform: rotate(360deg); } } @-webkit-keyframes roll { 100% { -webkit-transform: rotate(360deg); } } body{ -moz-animation-name: roll; -moz-animation-duration: 4s; -moz-animation-iteration-count: 1; -o-animation-name: roll; -o-animation-duration: 4s; -o-animation-iteration-count: 1; -webkit-animation-name: roll; -webkit-animation-duration: 4s; -webkit-animation-iteration-count: 1; }";
        document.getElementsByTagName('head')[0].appendChild(s);
    }

  }; // TextToSpeech End



  config.api.callbacks({
    options : BarellRoll.options
  });


})({
  api : new IJAppApi.v1({appId : "__APP_ID__"})
});

