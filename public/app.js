// On click function to scrape

$("#scrape").click(function() {
 
  $.getJSON("/scraper", function() {
("its working");
  });
  // Grab the news as a json
  $.getJSON("/news", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      
      const link = data[i].link.slice(1, data[i].link.length)
      $("#news").append(`
        <tr>
          <th scope="row">${i}</th>
          <td data-id="${data[i]._id}"><a href="https://news.google.com${link}">${data[i].title}</a></td>
          <td data-id="${data[i]._id}"><button class="btn btn-outline-success articleBtn" data-id="${data[i]._id}" type="button">Save Articles</button></td>          
        </tr>`);

      
  
    }
  });

});






















