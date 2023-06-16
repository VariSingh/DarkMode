const darkModeBtn = document.getElementById("dark-mode");

const getActiveTabId = async () => {
    try {
        const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
        return tabs[0].id;
    } catch (error) {
        console.error("Error retrieving active tab:", error);
        throw error;
    }
}

darkModeBtn.addEventListener("click", async () => {
    const data = await new Promise((resolve) => chrome.storage.local.get("darkMode", (result) => resolve(result)));
    const my_tabid = await getActiveTabId();
    if (data.darkMode) {
      await new Promise((resolve) => chrome.storage.local.set({ darkMode: false }, () => resolve()));
      darkModeBtn.innerText = "Dark Mode";
      chrome.scripting.executeScript({
        target: { tabId: my_tabid },
        function: () => {
            document.body.classList.remove("dark-mode");
            document.body.classList.add("light-mode");
        }
      });
      chrome.scripting.insertCSS({
        target: { tabId: my_tabid },
        files: ["content.css"], // Replace with the appropriate CSS file name
      });
      
    } else {
      await new Promise((resolve) => chrome.storage.local.set({ darkMode: true }, () => resolve()));
      darkModeBtn.innerText = "Light Mode";
      chrome.scripting.executeScript({
        target: { tabId: my_tabid },
        function: () => {
            document.body.classList.remove("light-mode");
            document.body.classList.add("dark-mode");
        }
      });
      chrome.scripting.insertCSS({
        target: { tabId: my_tabid },
        files: ["content.css"], // Replace with the appropriate CSS file name
      });
    }
  });
  