(function(config) {
  
  var PDF_Converter = { // Start



    options : function() {
      PDF_Converter.render();
    },

    
    
    // Shows WAIT Image in the Start and calls DOM creation function
    render : function(){
      var obj = PDF_Converter.searchAndCreate();
      obj.html("<div>\
                  <img style='padding:10px 0px;' src='http://localhost/javascript/html_to_pdf_converter/wait.gif'/>\
                </div>\
                <div>Loading ....</div>")
              .css({'text-align' : 'center'});
      PDF_Converter.getStatus( function(status){
        if(status == true){
          PDF_Converter.createSuccessDom();
        }
        else{
          PDF_Converter.createFailureDom();
        }
      });
    },// render Function Ends
    
    
    
    // Creates Failure DOM
    createFailureDom : function(){
      
      var Url = "http://api.joliprint.com/api/rest/url/print/s/html_to_pdf_converter_app?url=" + window.location.href;
      
      var obj = PDF_Converter
                .searchAndCreate()
                .html('<img src="http://localhost/javascript/html_to_pdf_converter/alert.png" alt="ERROR"/>\
                       <h3><center>PDF cannot be created!!!</center></h3>\
                       For further info: <a href="' + Url + '"  target="_newtab">Error Page</a>');
    },// Create Failure DOM Function Ends
    
    

    // Creates Success DOM and associated events
    createSuccessDom : function() {
          
      var Url = "http://api.joliprint.com/api/rest/url/print/s/html_to_pdf_converter_app?url=" + encodeURIComponent(window.location.href);
      
      var obj = PDF_Converter.searchAndCreate().html(
      "<center>\
      <p style='margin-top:10px; margin-bottom:0px; font-size:12px;'><button id='PDF_Converter-Button'>Download PDF</button></p>\
      <br/>\
      <h1><b>Share this PDF</b></h1>\
      <div style='cursor:pointer;'>\
        <img id='fbClick' src='http://localhost/javascript/html_to_pdf_converter/fb.png'title='Share on Facebook'/>\
        <img id='twClick' src='http://localhost/javascript/html_to_pdf_converter/tw.png'title='Share on Twitter'/>\
        <img id='liClick' src='http://localhost/javascript/html_to_pdf_converter/li.png'title='Share on LinkedIn'/>\
        <img id='gdClick' src='http://localhost/javascript/html_to_pdf_converter/gd.png'title='Save in Google Docs'/>\
      </div>\
      </center>"
      );
      // Download Button Click Event Association
      $j("#PDF_Converter-Button").button({
        icons: {
          primary: "ui-icon-gear"
        }
      })
      .click(function(event) {
        
        if(PDF_Converter.isValidUrl(Url) == true)
        {
          window.open(Url, '_newtab');
        }
        $j("#PDF_Converter").wijdialog("refresh");
        return false;
      });
      // Associated with Facebook Share
      $j("#fbClick").click(function() {
        PDF_Converter.appClick("http://www.facebook.com/sharer.php?t=" + encodeURIComponent(document.title) + "&u=" + encodeURIComponent(Url));
      });
      // Associated with Twitter Share
      $j("#twClick").click(function() {
        PDF_Converter.appClick("http://twitter.com/share?text=" + encodeURIComponent(document.title) + "&url=" + encodeURIComponent(Url));
      });
      // Associated with LinkedIn Share
      $j("#liClick").click(function() {
        PDF_Converter.appClick("http://www.linkedin.com/shareArticle?mini=true&url=" + encodeURIComponent(Url) + "&title=" + encodeURIComponent(document.title));
      });
      // Associated with Google Docs Link
      $j("#gdClick").click(function() {
        PDF_Converter.appClick("https://docs.google.com/viewer?url=" + Url);
      });

    },// Create Success DOM Function Ends



    // checks validity of the URL before conversion
    isValidUrl : function(url) {
      return ((url) && (url.length > 0) && ((url.indexOf("http://") != -1) || (url.indexOf("https://") != -1)))
    }, // isValidUrl Function Ends
    
    
    
    // Search or Create a Dialog Box    
    searchAndCreate : function(){
      var obj;
      if($j("#PDF_Converter").length > 0)
      {
        obj = $j("#PDF_Converter");
      }
      else
      {  obj = $j("<div/>", {id : "PDF_Converter"})
              .appendTo($j("body"))
              .wijdialog({
                width : 380,
                height: 220,
                title : "HTML Page to PDF Converter",
                modal : true,
                captionButtons: {pin: {visible: false}, refresh: {visible: false}, toggle: {visible: false}, minimize: {visible: false}, maximize: {visible: false}},
                close : function(event, ui){
                  $j("#PDF_Converter").remove();
                }
              });
              $j("#ui-dialog-title-PDF_Converter").css('font-size', 18);
      }
      return obj;
    }, // searchAndCreate Function Ends
    
    
    
    // Returns True or False according to the returned JSON Status
    getStatus : function(callback){
      $j.ajax({
        dataType: 'jsonp',
        url: 'http://api.joliprint.com/api/rest/url/json/s/foo?url=' + window.location.href + '?callback=?',
        success: function (data) {
        if(data.status_code == "200") {
          callback(true);
        } else {
          callback(false);
        }
        
      },
      });
    }, // getStatus Function Ends
       


    // Handles clicks for social sharing
    appClick : function(url){
      window.open(url, '_newtab');
    }, // appClick Function ends



  }; // PDF_Converter Ends



  config.api.callbacks({
    options : PDF_Converter.options,
  });

})({
  api : new IJAppApi.v1({appId : "__APP_ID__"})
});
