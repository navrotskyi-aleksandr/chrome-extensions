"use strict";

// For more information on Panels API,
// See https://developer.chrome.com/extensions/devtools_panels

// We will create a panel to detect
// whether current page is using React or not.

import "./panel.css";

chrome.devtools.inspectedWindow.eval(
  "window.React.version",
  (result, isException) => {
    let message = "";
    if (isException) {
      message = "DMarket";
    } else {
      message = `The page is using React v${result} ✅`;
    }

    document.getElementById("message").innerHTML = message;
  }
);

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: "GREETINGS",
    payload: {
      message: "Hello, my name is Pan. I am from Panel.",
    },
  },
  (response) => {
    console.log(response.message);
  }
);


async function fetchData() {
  const options = {
    method: "GET",
  };

  const res = await fetch(
    "https://api.dmarket.com/exchange/v1/market/items?side=market&orderBy=personal&orderDir=desc&title=&priceFrom=0&priceTo=0&treeFilters=&gameId=a8db&types=dmarket&cursor=&limit=5&currency=USD&platform=browser&isLoggedIn=false",
    options
  );
  const record = await res.json();

  document.getElementById("items").innerHTML = record.objects
    .slice(0, 3)
    .map((item) => `<li>${item.title}</li>`)
    .join("");
}

fetchData();
