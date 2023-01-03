/* Copyright 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "net/ssl/openssl_ssl_util.h"

#define NetLogOpenSSLError \
  DLOG(INFO) << "NetLogOpenSSLError:" << host_and_port_.host(); NetLogOpenSSLError

#include "src/net/socket/ssl_client_socket_impl.cc"

#undef NetLogOpenSSLError

