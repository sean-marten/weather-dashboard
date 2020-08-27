$(document).ready(function () {
  // Declare constants
  const $search = $(".search");
  const $input = $(".input");
  const $name = $(".name");
  const $temp = $(".temp");
  const $wind = $(".wind");
  const $humidity = $(".humidity");
  const $uvi = $(".uvi");
  const $forecastCards = $(".forecast-cards");
  const $recentSearches = $(".recent-searches");
  const rtw = [$name, $temp, $humidity, $wind, $uvi];
  const rtwTags = {
    prepend: ["", "Temperature: ", "Humidity: ", "Wind Speed: ", "UV Index: "],
    append: ["", "\u00B0F", "%", " MPH", ""],
  };
  const apiKey = "d591982fee792f7bb7e113410b2ec08f";
  let recentSearches = [];

  init();

  // Initialize the planner by checking if there is locally stored data
  function init() {
    var storedSearches = JSON.parse(localStorage.getItem("recentSearches"));
    if (storedSearches !== null) {
      recentSearches = storedSearches;
    }
    renderSearches();
  }

  function renderSearches() {
    $recentSearches.html("");
    for (
      let i = 0;
      i < (recentSearches.length < 5 ? recentSearches.length : 5);
      i++
    ) {
      $anchor = $("<p>").addClass("list-group-item").text(recentSearches[i]);
      $recentSearches.append($anchor);
    }
  }

  function search() {
    let searchValue = $input.val();
    updateStorage(searchValue);
    $.get(
      `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&units=imperial&appid=${apiKey}`
    ).then(function (resp) {
      const { name, main, wind, coord } = resp;
      uvi = 0;
      $.get(
        `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`
      ).then(function (resp) {
        const uvi = resp.value;
        const rtwData = [name, main.temp, main.humidity, wind.speed, uvi];
        for (let i = 0; i < rtw.length; i++) {
          rtw[i].text(rtwTags.prepend[i] + rtwData[i] + rtwTags.append[i]);
        }
      });
    });

    $.get(
      `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&units=imperial&appid=${apiKey}`
    ).then(function (resp) {
      for (let i = 0; i < 5; i++) {
        console.log(resp.list[i * 8]);
        const { main, dt_txt } = resp.list[i * 8];
        const $card = $("<div>")
          .addClass("card bg-primary text-white text-center")
          .css({
            width: "10rem",
            margin: "5px",
            border: "solid black 2px",
          });
        const $body = $("<div>").addClass("card-body");
        const $title = $("<h5>")
          .addClass("card-title")
          .text(moment(dt_txt).format("L"));
        const $temp = $("<p>")
          .addClass("card-text")
          .text(`Temp: ${main.temp}\u00B0F`);
        const $humid = $("<p>")
          .addClass("card-text")
          .text(`Humidity: ${main.humidity}%`);
        $card.append($body.append($title, $temp, $humid));
        $forecastCards.append($card);
      }
    });
  }
  //   <a href="#" class="list-group-item list-group-item-action">
  //   Cras justo odio
  // </a>
  $search.on("click", search);

  function updateStorage(text) {
    recentSearches.unshift(text);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    renderSearches();
  }
});
