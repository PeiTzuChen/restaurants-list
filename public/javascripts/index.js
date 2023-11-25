"use strict";

const form = document.querySelector("#search-form");
const select = document.querySelector("#order");

select.addEventListener("change", (event) => {
  form.submit()
});
