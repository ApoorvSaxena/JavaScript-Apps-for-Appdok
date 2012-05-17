(function(config) {

  var FacebookShare = {  // Start

    env : "dev",

    config : {
      "prod" : "http://cs.adomado.com",
      "dev"  : "http://localhost/javascript/facebook_share"
    },
    
    options : function() {
      config.api.loadResources([FacebookShare.config[FacebookShare.env] + "/assets/style.css"], function() {
        FacebookShare.createui();
        FacebookShare.addevents();
      });  
    },



    createui :function() {
      jQuery("<div/>", {id : "facebook-share"})
      .appendTo(jQuery("body"))
      .wijdialog({
      width: 463,
      height: 430,
      autoOpen: true,
      captionButtons: {pin: {visible: false}, refresh: {visible: false}, toggle: {visible: false}, minimize: {visible: false}, maximize: {visible: false}},
      title : "Facebook Link Share",
      close : function() { jQuery("#facebook-share").remove(); }
      });
      jQuery('#facebook-share').html('\
      <div id="stylized" class="myform">\
        <form name="myform">\
          <h1>Share Link on Facebook</h1>\
          <p>Add custom title, description and thumbnail image to Facebook Link</p>\
          <label>Title\
          <span class="small">Add your Link Title</span>\
          </label>\
          <input type="text" id="title" name="title" class="textline" placeholder="Link Title" title="Link Title"/><br />\
          <label>Link URL\
          <span class="small">Add your Link URL</span>\
          </label>\
          <input type="text" id="url" name="link" class="textline" placeholder="Link URL" title="Link URL"/><br />\
          <label>Description\
          <span class="small">Add small description of Link</span>\
          </label>\
          <textarea rows="3" cols="40" id="desc" name="desc" class="textbox" placeholder="Link Description" title="Link Description"></textarea><br />\
          <label>Thumbnail\
          <span class="small">Add Thumbnail Image</span></label>\
          <input type="radio" name="radio" value="1" class="radio"/>Generate Image Automatically<br/>\
          <input type="radio" name="radio" value="0" class="radio"/>Add Image from the Web\
          <input type="text" id="imgurl" name="webimgurl" class="textline" placeholder="Thumbnail URL" title="Thumbnail URL" style="display:none;"/><br/><br/><br/>\
          <div id="process-button">\
            <button>Process</button>\
          </div>\
        <form>\
      </div>\
      ');
   
    },



    addevents :function() {
      var checkimgurl;
      jQuery('input[name="radio"]').change(function(){
        if (jQuery('input[name="radio"]:checked').val() == '1') {
          jQuery('#imgurl').css("display", "none");
          checkimgurl = 0;
        }
        else{
          jQuery('#imgurl').css("display", "block");
          checkimgurl = 1;
        }
      });
      jQuery("#process-button").click(function() {
           myform.title.disabled = true;
           myform.link.disabled = true;
           myform.desc.disabled = true;
           jQuery("input[name='radio']").attr('disabled', 'disabled');
           myform.webimgurl.disabled = true;
           var share_url = "http://www.facebook.com/sharer.php?";
           var title = jQuery("#title").val();
           var link_url = jQuery("#url").val();
           var img_url;
           if (checkimgurl == 0) {
            img_url = encodeURIComponent("http://pdfmyurl.com/?url=" + link_url + "&--thumb");
           }
           else {
            img_url = jQuery("#imgurl").val();
           }
           var desc = jQuery("#desc").val();
           var url = share_url + "s= 100&amp;p[title]=" + title + "&amp;p[url]=" + link_url + "&amp;p[images][0]=" + img_url + "&amp;p[summary]=" + desc;  
           jQuery('#process-button').html('<a href="' + url + '" target="_blank" id="fblink">Share Link on Facebook</a>');
      });
    }


  }; // HelloWorld End



  config.api.callbacks({
    options : FacebookShare.options
  });


})({
  api : new IJAppApi.v1({appId : "__APP_ID__"})
});

