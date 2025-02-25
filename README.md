# Mises Browser Official Repo
Mises Browser is a pioneering mobile Web3 browser that combines speed, security, and support for browser extensions. Designed to enhance the mobile Web3 experience, it enables seamless interaction with decentralized applications (DApps) directly from your smartphone.

Available for both Android and iOS devices, Mises Browser empowers users to engage with the decentralized web effortlessly, bringing the full potential of Web3 to the palm of your hand.

For a visual introduction and to see Mises Browser in action, check out the following video:

[![Mises Browser Introduction](https://img.youtube.com/vi/SgOEfqzf3Bc/1.jpg)](https://www.youtube.com/watch?v=SgOEfqzf3Bc)


# Build Environment Setup Guide  

## Prerequisites  
Before you start, ensure you have knowledge of:  
- **Node.js** and **Yarn**  
- **Python**  
- **Ninja** build system  
- **Chromium build system**  [chromium android_build_instructions](https://chromium.googlesource.com/chromium/src/+/main/docs/android_build_instructions.md)

Currently Mises Browser for android build on ubuntu only , please make sure your os met [System requirements
](https://chromium.googlesource.com/chromium/src/+/main/docs/android_build_instructions.md#System-requirements)
## Steps to Build  

### 1. Clone the Repository  
```sh
git clone https://github.com/mises-id/mises-browser-core.git
cd mises-browser-core
```

### 2. Install Dependencies
Run the following command to install Node.js dependencies:
```sh
mkdir src
mkdir vendor
yarn
```

### 3. Initialize the Chromium Codebase
Set up the Chromium codebase, download dependencies, and apply all patches:

```sh
yarn browser_init
```

This fisrt time run prepares deps for Linux

### 4. Add Android build deps

Edit the .gclient file and add the following line:

```sh
target_os = ['android']
```

Run browser_init again to install deps for android

```sh
yarn browser_init 
```

### 5. Build the Project for android
To start a cross build for android, run:
```sh
yarn build Debug --target_os android --target_arch arm64
```


Additional Notes
Make sure you are able to access all google related codebase and service to build Mises Browser successfully.
Enjoy building for Web3! 🚀
