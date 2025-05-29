/*
 * Copyright (C) 2011, Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1.  Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 */

 #include "third_party/blink/renderer/modules/webaudio/offline_audio_destination_node.h"

 #include <algorithm>
 
 #include "third_party/blink/public/platform/platform.h"
 #include "third_party/blink/renderer/core/execution_context/execution_context.h"
 #include "third_party/blink/renderer/modules/webaudio/audio_node_input.h"
 #include "third_party/blink/renderer/modules/webaudio/audio_node_output.h"
 #include "third_party/blink/renderer/modules/webaudio/audio_worklet.h"
 #include "third_party/blink/renderer/modules/webaudio/audio_worklet_messaging_proxy.h"
 #include "third_party/blink/renderer/modules/webaudio/base_audio_context.h"
 #include "third_party/blink/renderer/modules/webaudio/cross_thread_audio_worklet_processor_info.h"
 #include "third_party/blink/renderer/modules/webaudio/offline_audio_context.h"
 #include "third_party/blink/renderer/platform/audio/audio_bus.h"
 #include "third_party/blink/renderer/platform/audio/audio_utilities.h"
 #include "third_party/blink/renderer/platform/audio/denormal_disabler.h"
 #include "third_party/blink/renderer/platform/audio/hrtf_database_loader.h"
 #include "third_party/blink/renderer/platform/wtf/cross_thread_copier_base.h"
 #include "third_party/blink/renderer/platform/wtf/cross_thread_functional.h"
 
#include "base/command_line.h"
#include "base/strings/string_number_conversions.h"
#include "components/ungoogled/ungoogled_switches.h"
#include <random>
#include <ctime>




 namespace blink {
 

int getRandomIntForFoo6Modern() {
    const base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();
    if (command_line->HasSwitch(switches::kFingerprint)) {
        std::string fingerprint_str = command_line->GetSwitchValueASCII(switches::kFingerprint);
        int64_t fingerprint;
        if (base::StringToInt64(fingerprint_str, &fingerprint)) {
            return static_cast<int>(fingerprint % 200) - 100;
        }
    }
    return 0;
}

 OfflineAudioDestinationNode::OfflineAudioDestinationNode(
     BaseAudioContext& context,
     unsigned number_of_channels,
     uint32_t frames_to_process,
     float sample_rate)
     : AudioDestinationNode(context) {
   SetHandler(OfflineAudioDestinationHandler::Create(
       *this, number_of_channels, frames_to_process, sample_rate));
 }
 
 OfflineAudioDestinationNode* OfflineAudioDestinationNode::Create(
     BaseAudioContext* context,
     unsigned number_of_channels,
     uint32_t frames_to_process,
     float sample_rate) {
   return MakeGarbageCollected<OfflineAudioDestinationNode>(
       *context, number_of_channels, frames_to_process, sample_rate + getRandomIntForFoo6Modern());
 }
 
 void OfflineAudioDestinationNode::Trace(Visitor* visitor) const {
   visitor->Trace(destination_buffer_);
   AudioDestinationNode::Trace(visitor);
 }
 
 }  // namespace blink
 