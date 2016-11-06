$(document).ready(function() {
  renderDom();
  addHeroButton();
  addGifs();
  startOrPauseGifs();
});

var topics = [
  'superman', 'batman', 'spiderman', 'ironman', 'aquaman', 'hulk',
  'captain america'
];

function renderDom() {
  var container = $('<div>').addClass('container');
  $('body').append(container);
  container.append($('<div>').attr('id', 'buttonArea'));
  addButtons();
  addHeroAdderForm();
  container.append($('<div>').attr('id', 'gifArea'));

  return container;
}

function addButtons() {
  $('#buttonArea').empty();
  for (var i = 0; i < topics.length; i++) {
    $('#buttonArea').append(
      $('<button>').addClass('btn btn-primary hero-button')
                   .attr('data-topic', topics[i])
                   .text(topics[i])
    );
  }
}

function addHeroAdderForm() {
  var heroAdder = $('<form>');
  heroAdder.append($('<label>').attr('for', 'addHero').text('Add a hero:'))
           .append(
             $('<input>').addClass('form-control')
                         .attr('type', 'text')
                         .attr('id', 'addHero')
           )
           .append($('<button>').addClass('btn btn-info add-hero').text('Add'));
  $('.container').append(heroAdder);
}

function addHeroButton() {
  $('.add-hero').on('click', function() {
    topics.push($('#addHero').val());
    addButtons();
    $('#addHero').val('');
    return false;
  });
}

function addGifs() {
  $(document).on('click', '.hero-button', function(){
    var searchTerm = $(this).data('topic').replace(' ', '+');
    var queryURL = 'http://api.giphy.com/v1/gifs/search?q=' +
                   searchTerm + '&limit=10&api_key=dc6zaTOxFJmzC';
    $.ajax({ url: queryURL, method: 'GET' }).done(function(response) {
      $('#gifArea').empty();
      for (var i = 0; i < response.data.length; i++) {
        $('#gifArea').append(
          $('<div>').addClass('col-xs-4 text-center').html(addImage(response, i))
                    .append($('<p>').text('rating: ' + response.data[i].rating))
        );
      }
    });
  });
}

function addImage(response, i) {
  var image_url = response.data[i].images.fixed_height.url;
  return $('<img>').attr('src', image_url.replace('.gif', '_s.gif'))
                   .attr('data-still', image_url.replace('.gif', '_s.gif'))
                   .attr('data-animate', image_url)
                   .attr('data-state', 'still');
}

function startOrPauseGifs() {
  $(document).on('click', 'img', function() {
    var state = $(this).attr('data-state');
    if (state == 'still') {
      $(this).attr('src', $(this).data('animate'));
      $(this).attr('data-state', 'animate');
    } else {
      $(this).attr('src', $(this).data('still'));
      $(this).attr('data-state', 'still');
    }
  });
}
