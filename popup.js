// document.addEventListener("DOMContentLoaded", function () {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     var url = tabs[0].url;
//     document.getElementById("url-input").value = url;
//     checkPhishing(url, "check");
//   });

//   document
//     .getElementById("url-form")
//     .addEventListener("submit", function (event) {
//       event.preventDefault();
//       var url = document.getElementById("url-input1").value;
//       checkPhishing(url, "result");
//     });
// });

// function checkPhishing(url, classname) {
//   fetch(`http://127.0.0.1:8000/api?url=${url}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       let test = data[0];
//       console.log(test);
//       console.log(typeof test);
//       var resultDiv = document.getElementsByClassName(classname)[0];
//       if (typeof test === "string") {
//         resultDiv.innerHTML = test;
//       } else {
//         resultDiv.innerHTML = data.msg;
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0 && tabs[0].url) {
      var url = tabs[0].url;
      document.getElementById("url-input").value = url;
      checkPhishing(url, "check"); // Check the current tab URL
    } else {
      console.error("Could not retrieve tab URL.");
      document.getElementsByClassName("check")[0].innerHTML =
        "Error retrieving URL.";
    }
  });

  document
    .getElementById("url-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      var url = document.getElementById("url-input1").value.trim(); // Get URL from input field

      if (url) {
        checkPhishing(url, "result"); // Check the user-inputted URL
      } else {
        document.getElementsByClassName("result")[0].innerHTML =
          "Please enter a URL.";
      }
    });
});

function checkPhishing(url, classname) {
  fetch(`http://127.0.0.1:8000/api?url=${encodeURIComponent(url)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data);
      var resultDiv = document.getElementsByClassName(classname)[0];

      if (!resultDiv) {
        console.error(`Element with class "${classname}" not found.`);
        return;
      }

      if (data && typeof data === "object") {
        if ("msg" in data) {
          resultDiv.innerHTML = data.msg;
        } else if (
          Array.isArray(data) &&
          data.length > 0 &&
          typeof data[0] === "string"
        ) {
          resultDiv.innerHTML = data[0];
        } else {
          resultDiv.innerHTML = "Unexpected API response format.";
        }
      } else {
        resultDiv.innerHTML = "Invalid response from API.";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementsByClassName(classname)[0].innerHTML =
        "Error fetching data.";
    });
}
