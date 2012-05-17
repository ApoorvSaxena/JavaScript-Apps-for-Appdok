(function(config) {

  var FacebookSearch = {  // Start

    env : "dev",

    paging_url : "",

    fbPerms : " user_likes,user_interests,user_videos,offline_access,read_stream",

    config : {
      "prod" : {fbAppId : "273794729329086", host : "http://cs.adomado.com"},
      "dev"  : {fbAppId : "273794729329086", host : "http://localhost/javascript/search_likes"}
    },



    options : function() {
      var fbAccessToken = config.api.getData("fbAccessToken");

      if(FacebookSearch.isValidAccessToken(fbAccessToken) == true)
      {
        config.api.loadResources([FacebookSearch.config[FacebookSearch.env].host + "/assets/zoomer.js", FacebookSearch.config[FacebookSearch.env].host + "/assets/zoomer.css"], function() {
          FacebookSearch.render();  
        });
      }
      else {
        FacebookSearch.startFBConnect();
      }
    },




    // returns true/false depending on if the access token is valid
    isValidAccessToken : function(fbAccessToken) {
      return (fbAccessToken || "").length > 25;
    },




    startFBConnect : function() {
      var image, message, fbAccessToken = config.api.getData("fbAccessToken");
      if(FacebookSearch.isValidAccessToken(fbAccessToken) == true) // true
      {
        image = "ok.gif";
        message = "Successfully connected with Facebook";
      }
      else
      {
        image = "spinner.gif";
        message = "Step 1";
      }

      $j("<div/>", {id : "custom-rss-form", style: "display:none;"}).html(
        "<div style='text-align:center; padding:10px;' id='fbn-options'>\
          <div id='FacebookSearch-message' style='font-size:16px; color:#000; margin-bottom:10px;'>" + message + "</div>\
          <img style='cursor:pointer;' id='fbn-fb-connect' src='" + FacebookSearch.config[FacebookSearch.env].host + "/assets" + "/fconnect.png'/>\
          <img src='" + FacebookSearch.config[FacebookSearch.env].host + "/assets/" + image + "' style='position:relative; top:-11px; left:3px; display:none;' id='FacebookSearch-connect-status'/>\
        </div>"
      ).appendTo($j("body"));

      $j("#custom-rss-form").wijdialog({
        title : "Facebook Search",
        width: 335,
        height: 190,
        captionButtons: {pin: {visible: false}, refresh: {visible: false}, toggle: {visible: false}, minimize: {visible: false}, maximize: {visible: false}},
        modal: true
      })
      .click(function(event) {
        $j("#FacebookSearch-connect-status").show();
        $j("#FacebookSearch-message").html("Connecting to Facebook. Please wait...");
        var popupUrl = FacebookSearch.config[FacebookSearch.env].host;
        new FBAuth(FacebookSearch.config[FacebookSearch.env].fbAppId, popupUrl, "", function(fbAccessToken) {}, FacebookSearch.fbPerms);
      });

      if(FacebookSearch.isValidAccessToken(fbAccessToken) == true)
        $j("#FacebookSearch-connect-status").css({top: "-6px"}).show();
    },




    // This function creates the UI and calls other functions for DOM Creation
    render : function() {
      var body = $j("body");
      // Creates the Wijmo Dialog Box with Wijmo Tabs Embedded
      $j('<div/>', {
         id : "fb-search-tabs",
         style : "margin : 0px; padding 0px !important;",
         html: "<ul>\
                  <li><a href='#tab'>Likes</a></li>\
                  <li><a href='#tab'>Links</a></li>\
                  <li><a href='#tab'>Movies</a></li>\
                  <li><a href='#tab'>Books</a></li>\
                  <li><a href='#tab'>Videos</a></li>\
                  <li><a href='#tab'>TV Shows</a></li>\
                  <li><a href='#tab'>Music</a></li>\
                  <li><a href='#tab'>Games</a></li>\
                </ul>\
                <div id='tab'>\
                  <center>\
                    <img style='padding:10px 0px;' src='" + FacebookSearch.config[FacebookSearch.env].host + "/assets/spinner_big.gif'/>\
                    <br/>\
                    <h3>Loading...</h3>\
                  </center>\
                </div>"
        })
        .appendTo(body)
        .wijtabs({ sortable: true,
                   event: 'click' })
        .wijdialog({
                   title : "Facebook Search",
                   width : 850,
                   height : 620,
                   id : "fb-search",
                   captionButtons: {pin: {visible: false}, refresh: {visible: false}, toggle: {visible: false}, minimize: {visible: false}, maximize: {visible: false}},
                   close : function(event, ui){
                   $j("#fb-search").remove();
                   $j("#fb-search-tabs").remove();
                   }
                   });     


      
      // Shows the Content of Likes Tab by Default
      FacebookSearch.fb_search( "likes", function(html_feed){
                $j('#tab').html(html_feed);
                // Zoomer Function Call
                $j('ul.thumb li').Zoomer({speedView:200,speedRemove:400,altAnim:true,speedTitle:400,debug:false});
      });



      // Tabs Select Function to change the content of tabs upon click using Asynchronous Function Callback
      $j("#fb-search-tabs").wijtabs({ select: function (e, ui) { 
              $j('#tab').html("\
                    <center>\
                      <img style='padding:10px 0px;' src='" + FacebookSearch.config[FacebookSearch.env].host + "/assets/spinner_big.gif'/>\
                      <br/>\
                      <h3>Loading...</h3>\
                    </center>");
              
              var index_hash = {"0" : "likes", "1" : "links", "2" : "movies", "3" : "books", "4" : "videos", "5" : "television", "6" : "music", "7" : "games"  };
              var query = index_hash[ui.index]

              FacebookSearch.fb_search( query, function(html_feed){
                $j('#tab').html(html_feed);
                $j('ul.thumb li').Zoomer({speedView:200,speedRemove:400,altAnim:true,speedTitle:400,debug:false});
              });

              
      } });// Tab Select Function Ends

      
    },// Render Function Ends



    //function to search or display links or likes using query as the parameter
    // query can also the Paging URL 
    fb_search: function(query, callback) {
      
      //var access_token = "193618910691964%7Cae13037055d914246df6acf3.1-100002026756044%7Cu7gq9pTcqdPv2tWv826UpVQogRs"
      var access_token = config.api.getData("fbAccessToken");
      var feed_url = "";

      if (FacebookSearch.isValidUrl(query)) {
        feed_url = query;
      }
      else {
        feed_url = 'https://graph.facebook.com/me/' +  query + '?access_token=' + access_token;
      }

      $j.ajax({   url : feed_url , dataType : "jsonp", jsonp: "callback",
      
      success : function(response) {
        
        var json_obj = response;
        var feed_html = [];
        
        if (!feed_url.match("links")) {
          feed_html.push('<ul class="thumb">');

          for (i=0; i<json_obj.data.length; i++ ) {
            if (json_obj.data[i].picture)
              feed_html.push('<li><a href="http://www.facebook.com/' + json_obj.data[i].id + '" target=_blank ><img src="'+ json_obj.data[i].picture + '" alt="'+ json_obj.data[i].name + '" /></a></li>');
            else
              feed_html.push('<li><a href="http://www.facebook.com/' + json_obj.data[i].id + '" target=_blank ><img src="https://graph.facebook.com/'+ json_obj.data[i].id + '/picture?type=large" alt="'+ json_obj.data[i].name + '" /></a></li>');
          }
        }
        else {
          feed_html.push('<ul class="links">');
          for (i=0; i<json_obj.data.length; i++ ) {
            if (json_obj.data[i].picture)
              feed_html.push('<li><a href="http://www.facebook.com/' + json_obj.data[i].id + '" target=_blank ><img src="'+ json_obj.data[i].picture + '" alt="'+ json_obj.data[i].name + '" />');
            else
              feed_html.push('<li><a href="http://www.facebook.com/' + json_obj.data[i].id + '" target=_blank ><img src="https://graph.facebook.com/'+ json_obj.data[i].id + '/picture?type=large" alt="'+ json_obj.data[i].name + '" />');
              feed_html.push('<h1>' + json_obj.data[i].name +'</h1></a>');
              feed_html.push('<p>' + json_obj.data[i].description +'</p></li>');
          }
        }

        // Try and Catch block usage to check whether the next property of Paging attribute
        // is avalable or not
        try { 
          // Statement to check whether paging is possible further or not
          json_obj.paging.next;
          FacebookSearch.paging_url = json_obj.paging.next;
          someurl = json_obj.paging.next;

          if($j('#feed-button').length==0) {

            $j('<div/>', {
                     id : "feed-button",
                     style : "margin : 0px;",
                     html: '<button href="#" class="myButton" style="clear:left;display:block;margin-left:30%;">Show more results</button>'
                     }).appendTo($j('#fb-search-tabs'));

            $j("#feed-button").click(function() {
                  if (FacebookSearch.paging_url) {
                    FacebookSearch.fb_search( FacebookSearch.paging_url, function(html_feed){
                      $j('#tab').append(html_feed);
                      $j('ul.thumb li').Zoomer({speedView:200,speedRemove:400,altAnim:true,speedTitle:400,debug:false});
                    });
                   } 
            }); // Click Event associated with the feed button

          } // If ends.. creating a feed button if not present

        } // Try block ends
        // Removes the Button to show more results if paging not possible further

        catch(err) {

          FacebookSearch.paging_url = "";
          if($j('#feed-button').length > 0)
            $j('#feed-button').remove();

        } // Catch block ends
      
        feed_html.push('</ul>');
        callback(feed_html.join('')); // Callback to the render function
      
      },// End of success function 

      });//End of IJBridge Function

    },//End of FB_SEARCH_LIKES



    // checks validity of the URL before conversion
    isValidUrl : function(url) {
      return ((url) && (url.length > 0) && ((url.indexOf("http://") != -1) || (url.indexOf("https://") != -1)))
    }, // isValidUrl Function Ends



  }; // FB Search Ends



  config.api.callbacks({
    options : FacebookSearch.options,
  });



})({
  api : new IJAppApi.v1({appId : "__APP_ID__"})
});