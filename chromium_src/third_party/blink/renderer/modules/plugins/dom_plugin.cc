/*
 *  Copyright (C) 2008 Nokia Corporation and/or its subsidiary(-ies)
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 *  MA 02110-1301 USA
 */

 #include "third_party/blink/renderer/modules/plugins/dom_plugin.h"

 #include "third_party/blink/renderer/core/frame/local_dom_window.h"
 #include "third_party/blink/renderer/core/page/plugin_data.h"
 #include "third_party/blink/renderer/platform/heap/garbage_collected.h"
 #include "third_party/blink/renderer/platform/wtf/text/atomic_string.h"
 
  
#include <random>
#include <string>
#include <vector>

#include "base/command_line.h"
#include "base/strings/string_number_conversions.h"
#include "components/ungoogled/ungoogled_switches.h"

namespace blink {


  namespace {
    uint64_t GetFingerprint() {
      const base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();
      if (!command_line->HasSwitch(switches::kFingerprintPlatform))
        return 0;

      std::string fingerprint_str = command_line->GetSwitchValueASCII(switches::kFingerprint);
      uint64_t fingerprint;
      if (!base::StringToUint64(fingerprint_str, &fingerprint))
        return 0;

      return fingerprint;
    }

    uint64_t HashString(const String& str) {
      uint64_t hash = 2166136261u;  // FNV-1a hash
      for (char c : str.Utf8()) {
        hash ^= c;
        hash *= 16777619u;
      }
      return hash;
    }

    String GetRandomPluginName(uint64_t seed) {
      std::mt19937_64 prng(seed);

      std::vector<String> chrome{"Chrome ", "Chromium ", "Google ",
                                "Web ", "Browser ", "OpenSource ",
                                "Online ", "JavaScript ", ""};
      std::vector<String> pdf{"PDF ",
                            "Portable Document Format ",
                            "portable-document-format ",
                            "document ",
                            "doc ",
                            "PDF and PS ",
                            "com.adobe.pdf "};
      std::vector<String> viewer{"Viewer", "Renderer", "Display", "Plugin",
                                "plug-in", "plug in", "extension", ""};

      StringBuilder result;
      result.Append(chrome[prng() % chrome.size()]);
      result.Append(pdf[prng() % pdf.size()]);
      result.Append(viewer[prng() % viewer.size()]);
      return result.ToString();
    }
    String GetRandomPluginDescription(uint64_t seed) {
      std::mt19937_64 prng(seed);
      std::vector<String> desc{
        "Portable Document Format", 
        "internal-pdf-viewer"
      };
      
      return desc[prng() % desc.size()];
    }

  } //namespace
 
 DOMPlugin::DOMPlugin(LocalDOMWindow* window, const PluginInfo& plugin_info)
     : ExecutionContextClient(window), plugin_info_(&plugin_info) {}
 
 void DOMPlugin::Trace(Visitor* visitor) const {
   visitor->Trace(plugin_info_);
   ScriptWrappable::Trace(visitor);
   ExecutionContextClient::Trace(visitor);
 }
 
 String DOMPlugin::name() const {
   uint64_t fingerprint = GetFingerprint();
   if (fingerprint) {
    // Combine fingerprint with hash of original name
    uint64_t name_hash = HashString(plugin_info_->Name());
    uint64_t final_seed = fingerprint ^ name_hash;
  
    return GetRandomPluginName(final_seed);
   }

   return plugin_info_->Name();
 }
 
 String DOMPlugin::filename() const {
   return plugin_info_->Filename();
 }
 
 String DOMPlugin::description() const {
   uint64_t fingerprint = GetFingerprint();
   if (fingerprint) {
      // Combine fingerprint with hash of original name
      uint64_t name_hash = HashString(plugin_info_->Name());
      uint64_t final_seed = fingerprint ^ name_hash;
    
      return GetRandomPluginDescription(final_seed);
   }
   return plugin_info_->Description();
 }
 
 unsigned DOMPlugin::length() const {
   return plugin_info_->GetMimeClassInfoSize();
 }
 
 DOMMimeType* DOMPlugin::item(unsigned index) {
   const MimeClassInfo* mime = plugin_info_->GetMimeClassInfo(index);
 
   if (!mime)
     return nullptr;
 
   return MakeGarbageCollected<DOMMimeType>(DomWindow(), *mime);
 }
 
 DOMMimeType* DOMPlugin::namedItem(const AtomicString& property_name) {
   const MimeClassInfo* mime = plugin_info_->GetMimeClassInfo(property_name);
 
   if (!mime)
     return nullptr;
 
   return MakeGarbageCollected<DOMMimeType>(DomWindow(), *mime);
 }
 
 void DOMPlugin::NamedPropertyEnumerator(Vector<String>& property_names,
                                         ExceptionState&) const {
   property_names.ReserveInitialCapacity(plugin_info_->GetMimeClassInfoSize());
   for (const MimeClassInfo* mime_info : plugin_info_->Mimes()) {
     property_names.UncheckedAppend(mime_info->Type());
   }
 }
 
 bool DOMPlugin::NamedPropertyQuery(const AtomicString& property_name,
                                    ExceptionState&) const {
   return plugin_info_->GetMimeClassInfo(property_name);
 }
 
 }  // namespace blink
 