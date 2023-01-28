// Copyright 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

function setupEvents() {
  const interstitialType = loadTimeData.getString('type');
  const lookalike = interstitialType === 'LOOKALIKE';
  if (lookalike) {
    $('body').classList.add('lookalike-url');
  }else {
    $('body').classList.add('phishing-url');
    // Override the default theme color.
    document.querySelector('meta[name=theme-color]').setAttribute('content',
      'rgb(217, 48, 37)');
  }
  $('icon').classList.add('icon');

  $('primary-button').addEventListener('click', function() {
    sendCommand(SecurityInterstitialCommandId.CMD_DONT_PROCEED);
  });

  $('main-content').classList.remove(HIDDEN_CLASS);
  const proceedButton = 'proceed-button';
  $(proceedButton).classList.remove(HIDDEN_CLASS);
  $(proceedButton).textContent = loadTimeData.getString('proceedButtonText');
  $(proceedButton).addEventListener('click', function(event) {
    sendCommand(SecurityInterstitialCommandId.CMD_PROCEED);
  });
}

document.addEventListener('DOMContentLoaded', setupEvents);
