document.addEventListener("DOMContentLoaded", () => {
  const requestsContainer = document.getElementById("requests-container");
  const requestTemplate = document.getElementById("request-template");
  const requestCount = document.getElementById("request-count");
  const refreshBtn = document.getElementById("refresh-btn");
  const clearBtn = document.getElementById("clear-btn");

  // Format timestamp to readable date
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  // Format JSON for display
  function formatJSON(obj) {
    if (!obj) return "null";
    try {
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return "Error formatting JSON";
    }
  }

  // Load requests from server
  async function loadRequests() {
    try {
      const response = await fetch("/api/requests");
      if (!response.ok) throw new Error("Failed to fetch requests");

      const requests = await response.json();
      requestsContainer.innerHTML = "";

      if (requests.length === 0) {
        requestsContainer.innerHTML =
          "<div class='loading'>No requests captured yet. Try making some requests to this server!</div>";
        requestCount.textContent = "0";
        return;
      }

      requestCount.textContent = requests.length;

      requests.forEach((request) => {
        const requestElement = requestTemplate.content.cloneNode(true);

        // Set request method and add appropriate class
        const methodEl = requestElement.querySelector(".request-method");
        methodEl.textContent = request.method;
        methodEl.classList.add(`method-${request.method}` || "method-OTHER");

        // Set other request details
        requestElement.querySelector(".request-path").textContent =
          request.path;
        requestElement.querySelector(".request-time").textContent =
          formatTimestamp(request.timestamp);

        // Format and set JSON data
        requestElement.querySelector(".request-headers").textContent =
          formatJSON(request.headers);
        requestElement.querySelector(".request-query").textContent = formatJSON(
          request.query
        );
        requestElement.querySelector(".request-body").textContent = formatJSON(
          request.body
        );

        // Add event listener for toggle button
        const toggleBtn = requestElement.querySelector(".toggle-btn");
        toggleBtn.addEventListener("click", () => {
          const details = toggleBtn
            .closest(".request-item")
            .querySelector(".request-details");
          const isVisible = details.style.display === "block";

          details.style.display = isVisible ? "none" : "block";
          toggleBtn.textContent = isVisible ? "Details" : "Hide";
        });

        requestsContainer.appendChild(requestElement);
      });
    } catch (error) {
      console.error("Error loading requests:", error);
      requestsContainer.innerHTML = `<div class='loading'>Error loading requests: ${error.message}</div>`;
    }
  }

  // Event listeners
  refreshBtn.addEventListener("click", loadRequests);

  clearBtn.addEventListener("click", () => {
    requestsContainer.innerHTML =
      "<div class='loading'>View cleared. Click Refresh to load requests again.</div>";
  });

  // Set up polling for new requests (every 10 seconds)
  setInterval(loadRequests, 10000);

  // Initial load
  loadRequests();
});
