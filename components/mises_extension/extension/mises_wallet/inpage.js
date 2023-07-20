class misesInjectedInpageScript {
  constructor() {
    const existingDescriptor = Object.getOwnPropertyDescriptor(window, "ethereum");
    const canRedefine = !existingDescriptor || existingDescriptor.configurable;
    console.log("default wallet fix ", existingDescriptor);
    if (canRedefine && window.ethereum) {
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
          "failed tp fix providers"
        );
      }

      console.log("default ethereum redefined");
      Object.defineProperty(window, "ethereum", {
        value: window.ethereum,
        configurable: false,
        writable: false,
      });
    }
  }
}
new misesInjectedInpageScript();