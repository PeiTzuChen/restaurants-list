"use strict";

const form = document.querySelector("#search-form");
const select = document.querySelector("#order");
const pageForm = document.querySelector("#page-form");
const pageNumber = document.querySelector("#page-number");

// 如果order list有改變值，提交表單
select.addEventListener("change", (event) => {
  form.submit()
});

//如果頁碼input有改變值，提交表單
pageNumber.addEventListener("change", (event) => {
  pageForm.submit();
});


