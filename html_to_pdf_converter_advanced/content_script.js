(function(config) {
  
  var PDF_Converter = { // Start



    options : function() {
      PDF_Converter.render();
    },

    
    
    // Shows WAIT Image in the Start and calls DOM creation function
    render : function(){
        if(PDF_Converter.isValidUrl(window.location.href) == true)
        {
          PDF_Converter.createSuccessDom();
        }
        else {
          PDF_Converter.createFailureDom();
        }
    },// render Function Ends
    
    
    
    // Creates Failure DOM
    createFailureDom : function(){
      var obj = PDF_Converter
                .searchAndCreate()
                .html('<img src="http://localhost/javascript/html_to_pdf_converter/alert.png" alt="ERROR"/>\
                       <h3><center>PDF cannot be created!!!</center></h3>');
    },// Create Failure DOM Function Ends
    
    

    // Creates Success DOM and associated events
    createSuccessDom : function() {
      var Url = 'http://pdfmyurl.com?url=' + window.location.href + '&--filename=' + document.title + '.pdf&--outline';
      var Image_url = 'http://pdfmyurl.com?url=' + window.location.href + '&--filename=' + document.title + '.png&--png';
      var obj = PDF_Converter.searchAndCreate().html(
      "<center>\
      <p style='margin-top:10px; margin-bottom:0px; font-size:12px;'>\
        <button id='PDF_Converter-Button'>Download PDF</button>\
        <button id='PDF_Previewer-Button'>Preview PDF</button></p>\
      <br/>\
      <h1><b>Share this PDF</b></h1>\
      <div style='cursor:pointer;'>\
        <img id='fbClick' src='http://localhost/javascript/html_to_pdf_converter/fb.png'title='Share on Facebook'/>\
        <img id='twClick' src='http://localhost/javascript/html_to_pdf_converter/tw.png'title='Share on Twitter'/>\
        <img id='liClick' src='http://localhost/javascript/html_to_pdf_converter/li.png'title='Share on LinkedIn'/>\
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
        window.open(Url, '_newtab');
        $j("#PDF_Converter").wijdialog("refresh");
        return false;
      });
      $j("#PDF_Previewer-Button").button({
        icons: {
          primary: "ui-icon-gear"
        }
      })
      .click(function(event) {
        window.open(Image_url, '_newtab');
        $j("#PDF_Converter").wijdialog("refresh");
        return false;
      });
      // Associated with Facebook Share
      $j("#fbClick").click(function() {
        PDF_Converter.appClick("http://www.facebook.com/sharer.php?s=100&amp;p[title]=" + document.title + "&amp;p[url]=" + Url + "&amp;p[images][0]=&amp;p[summary]=Drawing on");
      });
      // Associated with Twitter Share
      $j("#twClick").click(function() {
        PDF_Converter.appClick("http://twitter.com/share?text=" + encodeURIComponent(document.title) + "&url=" + encodeURIComponent(Url));
      });
      // Associated with LinkedIn Share
      $j("#liClick").click(function() {
        PDF_Converter.appClick("http://www.linkedin.com/shareArticle?mini=true&url=" + encodeURIComponent(Url) + "&title=" + encodeURIComponent(document.title));
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
