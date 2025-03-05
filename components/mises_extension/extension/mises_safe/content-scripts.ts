const postMsg = (id: any, res: unknown) => {
  const targetOrigin = window.location.origin;
  const contentToProxyMessage = {
    type: "mises-safe-proxy-request-response",
    id,
    result: { return: res },
  };
  window.postMessage(contentToProxyMessage, targetOrigin);
};


const initPostMsgClient = async () => {
  window.addEventListener("message", async (e) => {
    if (e.origin !== window.location.origin) {
      return;
    }
    if (!e.data || e.data.type !== "mises-proxy-request") {
      return;
    }
    if (typeof e.data.method === "undefined") {
      return;
    }
    if (e.data.method === "consoleLog") {
      console.log("content consoleLog:>>", e.data);
      return;
    }
    const res = await chrome.runtime.sendMessage(
      e.data
    );
    postMsg(e.data.id, res);
  });
};
//InjectedSafeScript
initPostMsgClient();
const body = document.head || document.documentElement;
const injectedMisesScript = document.createElement("script");
injectedMisesScript.src = chrome.runtime.getURL(
  "out/mises_safe_injected.bundle.js"
);
injectedMisesScript.type = "text/javascript";
body.insertBefore(injectedMisesScript, body.children[0]);
injectedMisesScript.remove();
document.addEventListener("DOMContentLoaded", () => {});


// mises-safe

