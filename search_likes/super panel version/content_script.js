(function(config) {

  var FacebookSearch = {  // Start

    options : function() {
      FacebookSearch.render();
    },


    render : function() {
      var body = $j("body");
      
      $j('<div/>', {
         id : "fb_search_tabs",
         style : "margin : 0px;",
         html: "<ul>\
                  <li><a href='#tab'>Likes</a></li>\
                  <li><a href='#tab'>Links</a></li>\
                </ul>\
                <div id='tab'>\
                  <center>\
                    <img style='padding:10px 0px;' src='http://localhost/javascript/search_likes/assets/wait.gif'/>\
                    <br/>\
                    <h3>Loading...</h3>\
                  </center>\
                </div>"
        }).appendTo(body).wijtabs({ sortable: true,
                                    event: 'click' }).wijdialog({
                                                                   title : "Facebook Search",
                                                                   width : 700,
                                                                   height : 620,
                                                                   id : "fb_search",
                                                                   close : function(event, ui){
                                                                     $j("#fb_search").remove();
                                                                     $j("#fb_search_tabs").remove();
                                                                   }
                                                                 });     


      // Shows the Content of Likes Tab by Default
      FacebookSearch.fb_search( "likes", function(html_feed){
                $j('#tab').html(html_feed);
      });



      // Tabs Select Function to change the content of tabs upon click using Asynchronous Function Callback
      $j("#fb_search_tabs").wijtabs({ select: function (e, ui) { 
              $j('#tab').html("\
                    <center>\
                      <img style='padding:10px 0px;' src='http://localhost/javascript/html_to_pdf_converter/wait.gif'/>\
                      <br/>\
                      <h3>Loading...</h3>\
                    </center>");
              
              var query = (ui.index == 0) ? "likes" : ((ui.index == 1) ? "links" : "videos");
              
              FacebookSearch.fb_search( query, function(html_feed){
                $j('#tab').html(html_feed);
              });
              
      } });// Tab Select Function Ends


    },// Render Function Ends



    //function to search or display links or likes using query as the parameter
    fb_search: function(query, callback) {
      
      var access_token = "193618910691964%7Cae13037055d914246df6acf3.1-100002026756044%7Cu7gq9pTcqdPv2tWv826UpVQogRs"
      
      new IJBridge({method : "get", url : 'https://graph.facebook.com/me/' +  query + '?access_token=' + access_token,
      
      success : function(data) {
          
        var json_obj = JSON.parse(data);
      
        var feed_html = [];
        feed_html.push('<style type="text/css">\
 .elements ul\
        {\
            padding: 8px 0 0 8px;\
            margin: 0px;\
            width: 600px;\
            float: left;\
            position: relative;\
        }\
        .elements ul li\
        {\
            background: #fff;\
            color: #fff;\
            height: 90px;\
            margin: 0 8px 8px 0;\
            padding: 15px;\
            padding-top: 62px;\
            position: relative;\
            width: 80px;\
        }\
        .elements li\
        {\
            float: left;\
            list-style: none;\
        }\
</style>\
                        <div id="superpanel" style="width: 640px; height: 280px;">\
                          <div class="elements">\
                            <ul>');
        //<img src="https://graph.facebook.com/'+ json_obj.data[i].id + '/picture?type=square" title="' + json_obj.data[i].name + '"/>
        if (query == "likes") {
          for (i=0; i<json_obj.data.length; i++ )
           feed_html.push('<li style="background-image:url(https://graph.facebook.com/'+ json_obj.data[i].id + '/picture?type=normal);background-repeat:no-repeat;background-position:center;"><center><h3 style="color:red;">'+ json_obj.data[i].name + '</h3></center></li>');
         }
        else {
          for (i=0; i<json_obj.data.length; i++ ) { 
            if (json_obj.data[i].picture) {
              feed_html.push('<img src=' + json_obj.data[i].picture + ' width=100 height=100 /><a href=' + json_obj.data[i].link +' target=_blank><b>' + json_obj.data[i].name + '</b></a><br/>');            
            }
            else {
              feed_html.push('<img src=wait.gif width=100 height=100 /><a href=' + json_obj.data[i].link +' target=_blank><b>' + json_obj.data[i].name + '</b></a><br/>');
            }  
          }
        }// If_Else Condition Ends
        //feed_html.push('' + json_obj.paging.next);
      feed_html.push('</ul></div></div>');
        
      callback(feed_html.join(''));
      
      },// End of success function 

      });//End of IJBridge Function

    },//End of FB_SEARCH_LIKES

  }; // FB Search Ends



  config.api.callbacks({
    options : FacebookSearch.options,
  });



})({
  api : new IJAppApi.v1({appId : "__APP_ID__"})
});