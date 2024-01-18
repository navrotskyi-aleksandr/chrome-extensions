"use strict";

import "./popup.css";

(function () {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const counterStorage = {
    get: (cb) => {
      chrome.storage.sync.get(["count"], (result) => {
        cb(result.count);
      });
    },
    set: (value, cb) => {
      chrome.storage.sync.set(
        {
          count: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  function setupCounter(initialValue = 0) {
    document.getElementById("counter").innerHTML = initialValue;

    document.getElementById("incrementBtn").addEventListener("click", () => {
      updateCounter({
        type: "INCREMENT",
      });
    });

    document.getElementById("decrementBtn").addEventListener("click", () => {
      updateCounter({
        type: "DECREMENT",
      });
    });
  }

  function updateCounter({ type }) {
    counterStorage.get((count) => {
      let newCount;

      if (type === "INCREMENT") {
        newCount = count + 1;
      } else if (type === "DECREMENT") {
        newCount = count - 1;
      } else {
        newCount = count;
      }

      counterStorage.set(newCount, () => {
        document.getElementById("counter").innerHTML = newCount;

        // Communicate with content script of
        // active tab by sending a message
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0];

          chrome.tabs.sendMessage(
            tab.id,
            {
              type: "COUNT",
              payload: {
                count: newCount,
              },
            },
            (response) => {
              console.log("Current count value passed to contentScript file");
            }
          );
        });
      });
    });
  }

  function restoreCounter() {
    // Restore count value
    counterStorage.get((count) => {
      if (typeof count === "undefined") {
        // Set counter value as 0
        counterStorage.set(0, () => {
          setupCounter(0);
        });
      } else {
        setupCounter(count);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", restoreCounter);

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: "GREETINGS",
      payload: {
        message: "Hello, my name is Pop. I am from Popup.",
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
})();
