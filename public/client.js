$(function(){
  
  $('body').on('click', 'a[data-block]', function(event){
    console.log("a")
    if(!confirm("sure?")){
      return false;
    }
    var target = $(event.currentTarget);

    $.ajax({
      type: 'DELETE', url: '/cities/' + target.data('block')
    }).done(function(){
      target.parents('li').remove();
    })
  })

  $.get('/cities', appendToList ); 

  function appendToList(cities) {
    var list = [];
    for(var i in cities){
      city = i
      var content = '<a href=/cities/'+  city + '>' + city + '</a>' + '<a href="#" class="x" data-block="'+ city + '"><img src="/del.png"></a>'
      list.push($('<li>', { html: content }));
    }
    $('.city-list').append(list);
  }
});
