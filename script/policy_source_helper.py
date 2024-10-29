#!/usr/bin/env python

# Copyright (c) 2019 The Brave Authors. All rights reserved.
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this file,
# You can obtain one at http://mozilla.org/MPL/2.0/. */


CHROMIUM_POLICY_KEY = 'SOFTWARE\\\\Policies\\\\MisesSoftware\\\\Mises'

android_fix = [
"CloudExtensionRequestEnabled",
"BlockExternalExtensions",
"ChromeAppsWebViewPermissiveBehaviorAllowed",
"ExtensionAllowInsecureUpdates",
"ExtensionAllowedTypes",
"ExtensionExtendedBackgroundLifetimeForPortConnectionsToUrls",
"ExtensionInstallAllowlist",
"ExtensionInstallBlocklist",
"ExtensionInstallForcelist",
"ExtensionInstallSources",
"ExtensionManifestV2Availability",
"ExtensionSettings",
"ExtensionUnpublishedAvailability",
"AllowDeletingBrowserHistory",
"AllowFileSelectionDialogs",
"AutoLaunchProtocolsFromOrigins",
"AutoOpenFileTypes",
"BrowserGuestModeEnabled",
"BrowserThemeColor",
"DefaultDownloadDirectory",
"DeveloperToolsAvailability",
"DeveloperToolsDisabled",
"DiskCacheDir",
"DownloadDirectory",
"FullscreenAllowed",
"HeadlessMode",
"ManagedAccountsSigninRestriction",
"NTPCustomBackgroundEnabled",
"WebAppSettings",
"Startup-RestoreOnStartup",
"RestoreOnStartup",
"ExtensionDeveloperModeSettings"
]
ios_fix = [
    "FullscreenAllowed",
    "IsolatedAppsDeveloperModeAllowed",
    "DefaultMidiSetting",
    "MidiAllowedForUrls",
    "MidiBlockedForUrls",
    "CloudProfileReportingEnabled",

]

def NeedFixForIOS(policy):
    if policy["name"] in ios_fix:
        return True
    if 'supported_on' not in policy:
        return False
    supported_ons = policy['supported_on']
    for supported_on in supported_ons:
        if supported_on.startswith("ios"):
            return False
    for supported_on in supported_ons:
        if supported_on.startswith("chrome.*:"):
            return True
    for supported_on in supported_ons:
        if supported_on.startswith("chrome.mac:"):
            return True
    return False



def FixPolicies(policies):
    for policy in policies:
        if policy["name"] in android_fix:
            print('fixing policy for android %s' % policy["name"])
            policy['supported_on'].append("android:112-")
        if NeedFixForIOS(policy):
            print('fixing policy for ios %s' % policy["name"])
            if 'supported_on' not in policy:
                policy['supported_on'] = []
            policy['supported_on'].append("ios:120-")
    return policies



def AddMisesPolicies(template_file_contents):
    highest_id = template_file_contents['highest_id_currently_used']
    policies = [
        {
            'name': 'TorDisabled',
            'type': 'main',
            'schema': {'type': 'boolean'},
            'supported_on': ['chrome.win:78-',
                             'chrome.mac:93-',
                             'chrome.linux:93-'],
            'features': {
                'dynamic_refresh': False,
                'per_profile': False,
                'can_be_recommended': False,
                'can_be_mandatory': True
            },
            'example_value': True,
            'id': 0,
            'caption': '''Disables the tor feature.''',
            'tags': [],
            'desc': ('''This policy allows an admin to specify that tor '''
                     '''must be disabled at startup.'''),
        },
        {
            'name': 'IPFSEnabled',
            'type': 'main',
            'schema': {'type': 'boolean'},
            'supported_on': ['chrome.*:87-', 'android:112-', 'ios:120-'],
            'future_on': [],
            'features': {
                'dynamic_refresh': False,
                'per_profile': True,
                'can_be_recommended': False,
                'can_be_mandatory': True
            },
            'example_value': True,
            'id': 1,
            'caption': '''Enable IPFS feature''',
            'tags': [],
            'desc': ('''This policy allows an admin to specify whether IPFS '''
                     '''feature can be enabled.'''),
        }
    ]
    old_policies = template_file_contents['policy_definitions']
    template_file_contents['policy_definitions'] = FixPolicies(old_policies)

    # Our new polices are added with highest id
    next_id = highest_id + 1
    for policy in policies:
        next_id += 1
        policy['id'] = next_id
        template_file_contents['policy_definitions'].append(policy)

    # Update highest id
    template_file_contents['highest_id_currently_used'] = highest_id + \
        len(policies)

def FixPolicyData(policy_data):
    print('FixPolicyData')
    policies = [
        {
            'name': 'TorDisabled',
            'type': 'main',
            'schema': {'type': 'boolean'},
            'supported_on': ['chrome.win:78-',
                             'chrome.mac:93-',
                             'chrome.linux:93-'],
            'features': {
                'dynamic_refresh': False,
                'per_profile': False,
                'can_be_recommended': False,
                'can_be_mandatory': True
            },
            'example_value': True,
            'id': 0,
            'caption': '''Disables the tor feature.''',
            'tags': [],
            'desc': ('''This policy allows an admin to specify that tor '''
                     '''must be disabled at startup.'''),
        },
        {
            'name': 'IPFSEnabled',
            'type': 'main',
            'schema': {'type': 'boolean'},
            'supported_on': ['chrome.*:87-', 'android:112-', 'ios:120-'],
            'future_on': [],
            'features': {
                'dynamic_refresh': False,
                'per_profile': True,
                'can_be_recommended': False,
                'can_be_mandatory': True
            },
            'example_value': True,
            'id': 1,
            'caption': '''Enable IPFS feature''',
            'tags': [],
            'desc': ('''This policy allows an admin to specify whether IPFS '''
                     '''feature can be enabled.'''),
        }
    ]
    old_policies = policy_data['policy_definitions']
    policy_data['policy_definitions'] = FixPolicies(old_policies)

    for policy in policies:
        policy_data['policy_definitions'].append(policy)