use_relative_paths = True

deps = {
  "vendor/bip39wally-core-native": "https://github.com/brave-intl/bat-native-bip39wally-core.git@0d3a8713a2b388d2156fe49a70ef3f7cdb44b190",
  "vendor/transifex": "https://github.com/transifex/transifex-python@103b6ac7ad937155f7f1497a68d5a05882664d58",
  "vendor/lxml": "https://github.com/lxml/lxml@d01872ccdf7e1e5e825b6c6292b43e7d27ae5fc4",
  "vendor/requests": "https://github.com/kennethreitz/requests@e4d59bedfd3c7f4f254f4f5d036587bcd8152458",
  "vendor/boto": "https://github.com/boto/boto@f7574aa6cc2c819430c1f05e9a1a1a666ef8169b",
  "vendor/challenge_bypass_ristretto_ffi": "https://github.com/brave-intl/challenge-bypass-ristretto-ffi.git@419995e4a873c294f1eaefca276f8ad25328e89f",
  "third_party/ethash/src": "https://github.com/chfast/ethash.git@e4a15c3d76dc09392c7efd3e30d84ee3b871e9ce",
  "third_party/bitcoin-core/src": "https://github.com/bitcoin/bitcoin.git@95ea54ba089610019a74c1176a2c7c0dba144b1c",
  "third_party/argon2/src": "https://github.com/P-H-C/phc-winner-argon2.git@62358ba2123abd17fccf2a108a301d4b52c01a7c",
  "third_party/rapidjson/src": "https://github.com/Tencent/rapidjson.git@06d58b9e848c650114556a23294d0b6440078c61",
}

recursedeps = [
  'vendor/omaha'
]

vars = {
  'download_prebuilt_sparkle': True
}

hooks = [
  {
    'name': 'bootstrap',
    'pattern': '.',
    'action': ['python', 'script/bootstrap.py'],
  },
  {
    # Download hermetic xcode for goma
    'name': 'download_hermetic_xcode',
    'pattern': '.',
    'condition': 'checkout_mac or checkout_ios',
    'action': ['vpython3', 'build/mac/download_hermetic_xcode.py'],
  },
  {
    'name': 'download_sparkle',
    'pattern': '.',
    'condition': 'checkout_mac and download_prebuilt_sparkle',
    'action': ['vpython3', 'build/mac/download_sparkle.py', '1.24.2'],
  },
  {
    'name': 'download_rust_deps',
    'pattern': '.',
    'condition': 'checkout_android',
    'action': ['vpython3', 'script/download_rust_deps.py', 'android'],
  },
  {
    'name': 'download_rust_deps',
    'pattern': '.',
    'condition': 'checkout_ios',
    'action': ['vpython3', 'script/download_rust_deps.py', 'ios'],
  },
  {
    'name': 'download_rust_deps',
    'pattern': '.',
    'condition': 'checkout_win',
    'action': ['vpython3', 'script/download_rust_deps.py', 'win32'],
  },
  {
    'name': 'download_rust_deps',
    'pattern': '.',
    'condition': 'checkout_mac',
    'action': ['vpython3', 'script/download_rust_deps.py', 'darwin'],
  },
  {
    'name': 'download_rust_deps',
    'pattern': '.',
    'condition': 'checkout_linux',
    'action': ['vpython3', 'script/download_rust_deps.py', 'linux'],
  },
  # {
  #   # Install Web Discovery Project dependencies for Windows, Linux, and macOS
  #   'name': 'web_discovery_project_npm_deps',
  #   'pattern': '.',
  #   'condition': 'not checkout_android and not checkout_ios',
  #   'action': ['vpython3', 'script/web_discovery_project.py', '--install'],
  # },
  # {
  #   'name': 'generate_licenses',
  #   'pattern': '.',
  #   'action': ['vpython3', 'script/generate_licenses.py'],
  # },
]

include_rules = [
  # Everybody can use some things.
  "+mises_base",
  "+crypto",
  "+net",
  "+sql",
  "+ui/base",

  "-chrome",
  "-mises/app",
  "-mises/browser",
  "-mises/common",
  "-mises/renderer",
  "-mises/services",
  "-ios",
  "-mises/third_party/bitcoin-core",
  "-mises/third_party/argon2",
]

# Temporary workaround for massive nummber of incorrect test includes
specific_include_rules = {
  ".*test.*(\.cc|\.mm|\.h)": [
    "+bat",
    "+mises",
    "+chrome",
    "+components",
    "+content",
    "+extensions",
    "+mojo",
    "+services",
    "+third_party",
  ],
}
