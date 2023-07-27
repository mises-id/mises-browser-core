class misesInjectedInpageScript {
  constructor() {
    if (!chrome.app.defaultEVMWalletID || chrome.app.defaultEVMWalletID == "") {
      console.log("default wallet fix skiped");
      return;
    }
    const existingDescriptor = Object.getOwnPropertyDescriptor(window, "ethereum");
    const canRedefine = !existingDescriptor || existingDescriptor.configurable;
    console.log("default wallet fix ", existingDescriptor);
    const providers = [];
    const keyProperty = chrome.app.defaultEVMWalletKeyProperty || "";
    if (window.ethereum) {
      let providerInstance = window.ethereum;
      try {
        if (!Array.isArray(window.ethereum.providers)) {
          window.ethereum.providers = [];
        }
        if (window.ethereum.providers.length == 0) {
          window.ethereum.providers.push(providerInstance);
        }
      } catch (e2) {
        console.warn(
          "failed to fix providers"
        );
      }
      providers.push(window.ethereum);
    }
    if (canRedefine) {
      console.log("default ethereum redefined");
      Object.defineProperty(window, "ethereum", {
        get() {
          if (providers.length == 0) {
            return;
          } 
          if (keyProperty != "") {
            const foundProvider = providers.find(function (value, index, array) {
              return value.hasOwnProperty(keyProperty);
            });
            if (foundProvider) return foundProvider;
          }
          return providers[0];
        },
        set(provider) {
          providers.push(provider);
          console.log("add ethereum provider", provider, providers);
        },
        configurable: false,
      });
    }

  } 
}
new misesInjectedInpageScript();
