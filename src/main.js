console.log("Executing main.js...");

if ("serviceWorker" in navigator) {
    console.log("Service worker capability present!");
    navigator.serviceWorker
      .register("./serviceworker.js")
      .then(serviceWorker => {
        console.log("Service Worker registered: ", serviceWorker);
      })
      .catch(error => {
        console.error("Error registering the Service Worker: ", error);
      });
  }