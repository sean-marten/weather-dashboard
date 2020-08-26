$(document).ready(function () {
  // Declar constants
  const $search = $(".search");
  const $input = $(".input");
  const apiKey = "d591982fee792f7bb7e113410b2ec08f";

  $search.on("click", function () {
    let searchValue = $input.val();
    $.get(
      `api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${apiKey}`
    ).then(function (resp) {
      console.log(resp);
    });
  });
});
