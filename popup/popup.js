const DARK_MODE = "Dark Mode";
const LIGHT_MODE = "Light Mode";
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

const switchBtn = (mode) => {
    if(mode === DARK_MODE){
        darkModeBtn.classList.remove("light");
        darkModeBtn.classList.add("dark");
    }else if(mode === LIGHT_MODE){
        darkModeBtn.classList.remove("dark");
        darkModeBtn.classList.add("light");
    }
}


const switchMode = async (mode) => {
    const my_tabid = await getActiveTabId();
    let darkMode = false;
    if(mode === DARK_MODE) {
        darkMode = true;
    }else if(mode === LIGHT_MODE){
        darkMode = false;
    }
    await new Promise((resolve) => chrome.storage.local.set({ darkMode }, () => resolve()));
    switchBtn();//Update button style
    darkModeBtn.innerText = mode;
    chrome.scripting.executeScript({
      target: { tabId: my_tabid },
      function: (mode,DARK_MODE,LIGHT_MODE) => {
        if(mode === DARK_MODE){
            document.body.classList.remove("dark-mode");
            document.body.classList.add("light-mode");
        }else if(mode === LIGHT_MODE){
            document.body.classList.remove("light-mode");
            document.body.classList.add("dark-mode");
        }
      },
        args: [mode,DARK_MODE,LIGHT_MODE]
    });
    chrome.scripting.insertCSS({
      target: { tabId: my_tabid },
      files: ["content.css"]
    });
};

darkModeBtn.addEventListener("click", async () => {
    const data = await new Promise((resolve) => chrome.storage.local.get("darkMode", (result) => resolve(result)));
    if (data.darkMode) {
        switchMode(LIGHT_MODE);
    } else {
        switchMode(DARK_MODE);
    }
  });
  