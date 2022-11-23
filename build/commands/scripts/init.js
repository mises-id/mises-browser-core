// Copyright (c) 2019 The Mises Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

const fs = require('fs')
const Log = require('../lib/sync/logging')
const path = require('path')
const { spawnSync } = require('child_process')
const util = require('../lib/util')

Log.progress('Performing symbolic link checkout of mises-browser-core')

const sourceDir = path.resolve(__dirname, '..', '..', '..')
const misesCoreDir = path.resolve(__dirname, '..', '..', '..', 'src', 'mises')

if (!fs.existsSync(path.join(misesCoreDir, '.git'))) {
  Log.status(`symbolic link mises-browser-core into ${misesCoreDir} ...`)
  fs.symlink(sourceDir, misesCoreDir, "dir", err => {  
    console.log("Symbolic link creation complete!");  
  });
  
}

let npmCommand = 'npm'
if (process.platform === 'win32') {
  npmCommand += '.cmd'
}


util.run(npmCommand, ['run', 'sync' ,'--', '--init'].concat(process.argv.slice(2)), {
  cwd: misesCoreDir,
  env: process.env,
  stdio: 'inherit',
  shell: true,
  git_cwd: '.', })