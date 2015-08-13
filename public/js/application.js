$(document).ready(function() {
  $("button").on("click", function(e){
    e.preventDefault();

    var request = $.post("/")
    request.done(function(response){
      // Iterate through the json object that has been processed in ruby already, for each AR comment object
      // response.each()
    })

  })
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them

  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
});
