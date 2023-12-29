# Copyright (c) 2023 The Brave Authors. All rights reserved.
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this file,
# You can obtain one at https://mozilla.org/MPL/2.0/.

import xml.etree.ElementTree as ET

def _InsertNode(parent, node_str, child_str):
    ns = {
        'android': 'http://schemas.android.com/apk/res/android',  #NOSONAR
        'app': 'http://schemas.android.com/apk/res-auto'  #NOSONAR
    }
    node = ET.fromstring(node_str, parser=ET.XMLParser(encoding="utf-8"))
    child = parent.find(child_str, namespaces=ns)
    child_idx = list(parent).index(child)
    parent.insert(child_idx + 1, node)

def _ProcessXML(root):
    # Register namespaces
    ns = {
        'android': 'http://schemas.android.com/apk/res/android',  #NOSONAR
        'app': 'http://schemas.android.com/apk/res-auto'  #NOSONAR
    }
    for prefix, uri in ns.items():
        ET.register_namespace(prefix, uri)

    
    parent = root.find('group/[@android:id="@+id/PAGE_MENU"]', namespaces=ns)

    mises_forward_node_str = '<item xmlns:android='\
    '"http://schemas.android.com/apk/res/android" '\
      'android:id="@+id/mises_forward_menu_id" ' \
      'android:title="@string/menu_mises_forward" ' \
      'android:icon="@drawable/ic_menu_mises_forward" />'
    mises_forward_child_str = 'item/[@android:id="@+id/icon_row_menu_id"]'
    _InsertNode(parent, mises_forward_node_str, mises_forward_child_str)

    new_home_tab_node_str = '<item xmlns:android='\
    '"http://schemas.android.com/apk/res/android" '\
      'android:id="@+id/new_home_tab_menu_id" ' \
      'android:title="@string/menu_new_home_tab" ' \
      'android:icon="@drawable/btn_toolbar_home" />'
    new_home_tab_child_str = 'item/[@android:id="@+id/new_tab_menu_id"]'
    _InsertNode(parent, new_home_tab_node_str, new_home_tab_child_str)


    extensions_node_str = '<item xmlns:android='\
        '"http://schemas.android.com/apk/res/android" '\
      'android:id="@+id/extensions_id" ' \
      'android:title="@string/main_menu_extensions" ' \
      'android:icon="@drawable/ic_extensions" />'
    extensions_child_str = 'item/[@android:id="@+id/recent_tabs_menu_id"]'
    _InsertNode(parent, extensions_node_str, extensions_child_str)

    mises_wallet_node_str = '<item xmlns:android='\
        '"http://schemas.android.com/apk/res/android" '\
      'android:id="@+id/mises_wallet_id" ' \
      'android:title="@string/main_menu_mises_wallet" ' \
      'android:icon="@drawable/ic_mises_wallet" />'
    mises_wallet_child_str = 'item/[@android:id="@+id/extensions_id"]'
    _InsertNode(parent, mises_wallet_node_str, mises_wallet_child_str)




    adblock_node_str = '<item xmlns:android='\
    '"http://schemas.android.com/apk/res/android" '\
            'android:id="@+id/adblock_row_menu_id" '\
            'android:title="@null"> '\
            '<menu> '\
                '<item android:id="@+id/adblock_id" '\
                  'android:title="@string/main_menu_adblock" /> '\
                '<item android:id="@+id/adblock_check_id" '\
                  'android:title="@null" '\
                  'android:checkable="true" /> '\
            '</menu> '\
            '</item>'
    adblock_child_str = 'item/[@android:id="@+id/request_desktop_site_row_menu_id"]'
    _InsertNode(parent, adblock_node_str, adblock_child_str)



    night_mode_switcher_node_str = '<item xmlns:android='\
            '"http://schemas.android.com/apk/res/android" '\
            'android:id="@+id/night_mode_switcher_id" '\
            'android:title="@string/main_menu_turn_on_night_mode" />'
    night_mode_switcher_child_str = 'item/[@android:id="@+id/reader_mode_prefs_id"]'
    _InsertNode(parent, night_mode_switcher_node_str, night_mode_switcher_child_str)

    developer_tools_node_str = '<item xmlns:android='\
            '"http://schemas.android.com/apk/res/android" '\
            'android:id="@+id/developer_tools_id" ' \
            'android:title="@string/main_menu_developer_tools" ' \
            'android:icon="@drawable/ic_devtools" />'
    developer_tools_child_str = 'item/[@android:id="@+id/auto_dark_web_contents_row_menu_id"]'
    _InsertNode(parent, developer_tools_node_str, developer_tools_child_str)

    disable_proxy_node_str = '<item xmlns:android='\
            '"http://schemas.android.com/apk/res/android" '\
            'android:id="@+id/disable_proxy_id" ' \
            'android:title="Disable Proxy" ' \
            'android:icon="@drawable/ic_devtools" />'
    disable_proxy_child_str = 'item/[@android:id="@+id/developer_tools_id"]'
    _InsertNode(parent, disable_proxy_node_str, disable_proxy_child_str)


    set_as_default_node_str = '<item xmlns:android='\
    '"http://schemas.android.com/apk/res/android" '\
      'android:id="@+id/set_default_browser" ' \
      'android:title="@string/menu_set_default_browser" />'
    set_as_default_child_str = 'item/[@android:id="@+id/managed_by_menu_id"]'
    _InsertNode(parent, set_as_default_node_str, set_as_default_child_str)

    clear_data_node_str = '<item xmlns:android='\
    '"http://schemas.android.com/apk/res/android" '\
      'android:id="@+id/clear_data_menu_id" ' \
      'android:title="@string/main_menu_clear_data" />'
    clear_data_child_str = 'item/[@android:id="@+id/set_default_browser"]'
    _InsertNode(parent, clear_data_node_str, clear_data_child_str)

    exit_node_str = '<item xmlns:android='\
    '"http://schemas.android.com/apk/res/android" '\
      'android:id="@+id/exit_id" ' \
      'android:title="@string/main_menu_exit" />'
    exit_child_str = 'item/[@android:id="@+id/clear_data_menu_id"]'
    _InsertNode(parent, exit_node_str, exit_child_str)

    return root
