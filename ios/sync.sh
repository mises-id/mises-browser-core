#!/bin/sh

#  sync.sh
#  all
#
#  Created by baoge on 2022/7/15.
#  

# cp -R /Users/baoge/Library/Developer/Xcode/DerivedData/MetaMask-ajaxbftsamxqvrabyxosvqvsgjuq/Build/Products/Debug-iphonesimulator/**/*.bundle ios/third_party/mises/Bundles


# rm -R third_party/mises/Sim/Frameworks/*
# rm -R third_party/mises/Device/Frameworks/*
# rm -R third_party/mises/Distribution/Frameworks/*



# rm -R /Users/baoge/Documents/work/mises-browser-core/src/out/Official-iphoneos/Mises.app

# rm -R /Users/baoge/Documents/work/mises-browser-core/src/out/Official-iphoneos/*.appex
# rm -R /Users/baoge/Documents/work/mises-browser-core/src/out/Official-iphoneos/ios_clang_arm64_13_0/*.appex


# rm -R /Users/baoge/Documents/work/mises-browser-core/src/out/Debug-iphoneos/Mises.app

# rm -R /Users/baoge/Documents/work/mises-browser-core/src/out/Debug-iphoneos/*.appex
# rm -R /Users/baoge/Documents/work/mises-browser-core/src/out/Debug-iphoneos/ios_clang_arm64_13_0/*.appex

# rm -R /Users/baoge/Documents/work/mises-browser-core/src/out/Debug-iphonesimulator/Mises.app
# rm -R /Users/baoge/Documents/work/mises-browser-core/src/out/Debug-iphonesimulator/*.appex
# rm -R /Users/baoge/Documents/work/mises-browser-core/src/out/Debug-iphonesimulator/ios_clang_arm64_13_0/*.appex


SOURCE_DIR=/Users/baoge/Library/Developer/Xcode/DerivedData/RepackMises-bwucaiybespifydntezdvpwrypho
cp /Users/baoge/Documents/work/mises-bundle/RepackMises/ios/bundle/main.jsbundle third_party/mises/Bundles

cp -R $SOURCE_DIR/Build/Products/Debug-iphonesimulator/**/*.a third_party/mises/Sim/Libs

cp -R $SOURCE_DIR/Build/Products/Debug-iphonesimulator/*.framework third_party/mises/Sim/Frameworks
cp -R $SOURCE_DIR/Build/Products/Debug-iphonesimulator/**/*.framework third_party/mises/Sim/Frameworks

cp -R $SOURCE_DIR/Build/Products/Debug-iphoneos/**/*.a third_party/mises/Device/Libs

cp -R $SOURCE_DIR/Build/Products/Debug-iphoneos/*.framework third_party/mises/Device/Frameworks
cp -R $SOURCE_DIR/Build/Products/Debug-iphoneos/**/*.framework third_party/mises/Device/Frameworks



cp -R $SOURCE_DIR/Build/Products/Release-iphoneos/**/*.a third_party/mises/Distribution/Libs

cp -R $SOURCE_DIR/Build/Products/Release-iphoneos/*.framework third_party/mises/Distribution/Frameworks
cp -R $SOURCE_DIR/Build/Products/Release-iphoneos/**/*.framework third_party/mises/Distribution/Frameworks


# cp -R /Users/baoge/Documents/work/sdk/sdk.xcframework/ios-arm64_x86_64-simulator/*.framework ios/third_party/mises/Sim/Frameworks

# cp -R /Users/baoge/Documents/work/sdk/sdk.xcframework/ios-arm64/*.framework ios/third_party/mises/Device/Frameworks


# cp -R /Users/baoge/Documents/work/sdk/sdk.xcframework/ios-arm64/*.framework ios/third_party/mises/Distribution/Frameworks


# cp -R /Users/baoge/Documents/work/firebase/FirebaseDynamicLinks/FirebaseDynamicLinks.xcframework/ios-arm64_x86_64-simulator/*.framework ios/third_party/mises/Sim/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseDynamicLinks/FirebaseDynamicLinks.xcframework/ios-arm64/*.framework ios/third_party/mises/Distribution/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseDynamicLinks/FirebaseDynamicLinks.xcframework/ios-arm64/*.framework ios/third_party/mises/Device/Frameworks


# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FirebaseCore.xcframework/ios-arm64_x86_64-simulator/*.framework ios/third_party/mises/Sim/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FirebaseCore.xcframework/ios-arm64/*.framework ios/third_party/mises/Distribution/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FirebaseCore.xcframework/ios-arm64/*.framework ios/third_party/mises/Device/Frameworks



# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/GoogleUtilities.xcframework/ios-arm64_x86_64-simulator/*.framework ios/third_party/mises/Sim/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/GoogleUtilities.xcframework/ios-arm64/*.framework ios/third_party/mises/Distribution/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/GoogleUtilities.xcframework/ios-arm64/*.framework ios/third_party/mises/Device/Frameworks



# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FirebaseCoreInternal.xcframework/ios-arm64_x86_64-simulator/*.framework ios/third_party/mises/Sim/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FirebaseCoreInternal.xcframework/ios-arm64/*.framework ios/third_party/mises/Distribution/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FirebaseCoreInternal.xcframework/ios-arm64/*.framework ios/third_party/mises/Device/Frameworks




# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FBLPromises.xcframework/ios-arm64_x86_64-simulator/*.framework ios/third_party/mises/Sim/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FBLPromises.xcframework/ios-arm64/*.framework ios/third_party/mises/Distribution/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FBLPromises.xcframework/ios-arm64/*.framework ios/third_party/mises/Device/Frameworks




# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FirebaseAnalytics.xcframework/ios-arm64_i386_x86_64-simulator/*.framework ios/third_party/mises/Sim/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FirebaseAnalytics.xcframework/ios-arm64_armv7/*.framework ios/third_party/mises/Distribution/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FirebaseAnalytics.xcframework/ios-arm64_armv7/*.framework ios/third_party/mises/Device/Frameworks



# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/GoogleAppMeasurement.xcframework/ios-arm64_i386_x86_64-simulator/*.framework ios/third_party/mises/Sim/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/GoogleAppMeasurement.xcframework/ios-arm64_armv7/*.framework ios/third_party/mises/Distribution/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/GoogleAppMeasurement.xcframework/ios-arm64_armv7/*.framework ios/third_party/mises/Device/Frameworks

# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/nanopb.xcframework/ios-arm64_x86_64-simulator/*.framework ios/third_party/mises/Sim/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/nanopb.xcframework/ios-arm64/*.framework ios/third_party/mises/Distribution/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/nanopb.xcframework/ios-arm64/*.framework ios/third_party/mises/Device/Frameworks



# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FirebaseInstallations.xcframework/ios-arm64_x86_64-simulator/*.framework ios/third_party/mises/Sim/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FirebaseInstallations.xcframework/ios-arm64/*.framework ios/third_party/mises/Distribution/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/FirebaseInstallations.xcframework/ios-arm64/*.framework ios/third_party/mises/Device/Frameworks

# cp -R /Users/baoge/Documents/work/firebase/FirebaseCrashlytics/FirebaseCrashlytics.xcframework/ios-arm64_x86_64-simulator/*.framework ios/third_party/mises/Sim/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseCrashlytics/FirebaseCrashlytics.xcframework/ios-arm64/*.framework ios/third_party/mises/Distribution/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseCrashlytics/FirebaseCrashlytics.xcframework/ios-arm64/*.framework ios/third_party/mises/Device/Frameworks

# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/GoogleDataTransport.xcframework/ios-arm64_x86_64-simulator/*.framework ios/third_party/mises/Sim/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/GoogleDataTransport.xcframework/ios-arm64/*.framework ios/third_party/mises/Distribution/Frameworks
# cp -R /Users/baoge/Documents/work/firebase/FirebaseAnalytics/GoogleDataTransport.xcframework/ios-arm64/*.framework ios/third_party/mises/Device/Frameworks

