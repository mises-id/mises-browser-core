#include "src/components/permissions/permission_request.cc"


namespace permissions {


#if BUILDFLAG(IS_ANDROID)


bool PermissionRequest::IsConfirmationChipSupported() {
  return permissions::IsConfirmationChipSupported(request_type_);
}

IconId PermissionRequest::GetIconForChip() {
  return permissions::GetIconId(request_type_);
}

IconId PermissionRequest::GetBlockedIconForChip() {
  return permissions::GetBlockedIconId(request_type_);
}

absl::optional<std::u16string> PermissionRequest::GetRequestChipText(
    ChipTextType type) const {
  static base::NoDestructor<std::map<RequestType, std::vector<int>>> kMessageIds(
      {{RequestType::kArSession, {IDS_AR_PERMISSION_CHIP, -1, -1, -1, -1, -1}},
       {RequestType::kCameraStream,
        {IDS_MEDIA_CAPTURE_VIDEO_ONLY_PERMISSION_CHIP, -1,
         IDS_PERMISSIONS_PERMISSION_ALLOWED_CONFIRMATION,
         IDS_PERMISSIONS_PERMISSION_NOT_ALLOWED_CONFIRMATION,
         IDS_PERMISSIONS_CAMERA_ALLOWED_CONFIRMATION_SCREENREADER_ANNOUNCEMENT,
         IDS_PERMISSIONS_CAMERA_NOT_ALLOWED_CONFIRMATION_SCREENREADER_ANNOUNCEMENT}},
       {RequestType::kClipboard,
        {IDS_CLIPBOARD_PERMISSION_CHIP, -1, -1, -1, -1, -1}},
       {RequestType::kGeolocation,
        {IDS_GEOLOCATION_PERMISSION_CHIP,
         IDS_GEOLOCATION_PERMISSION_BLOCKED_CHIP,
         IDS_PERMISSIONS_PERMISSION_ALLOWED_CONFIRMATION,
         IDS_PERMISSIONS_PERMISSION_NOT_ALLOWED_CONFIRMATION,
         IDS_PERMISSIONS_GEOLOCATION_ALLOWED_CONFIRMATION_SCREENREADER_ANNOUNCEMENT,
         IDS_PERMISSIONS_GEOLOCATION_NOT_ALLOWED_CONFIRMATION_SCREENREADER_ANNOUNCEMENT}},
       {RequestType::kIdleDetection,
        {IDS_IDLE_DETECTION_PERMISSION_CHIP, -1, -1, -1, -1, -1}},
       {RequestType::kMicStream,
        {IDS_MEDIA_CAPTURE_AUDIO_ONLY_PERMISSION_CHIP, -1,
         IDS_PERMISSIONS_PERMISSION_ALLOWED_CONFIRMATION,
         IDS_PERMISSIONS_PERMISSION_NOT_ALLOWED_CONFIRMATION,
         IDS_PERMISSIONS_MICROPHONE_ALLOWED_CONFIRMATION_SCREENREADER_ANNOUNCEMENT,
         IDS_PERMISSIONS_MICROPHONE_NOT_ALLOWED_CONFIRMATION_SCREENREADER_ANNOUNCEMENT}},
       {RequestType::kMidiSysex,
        {IDS_MIDI_SYSEX_PERMISSION_CHIP, -1, -1, -1, -1, -1}},
       {RequestType::kNotifications,
        {IDS_NOTIFICATION_PERMISSIONS_CHIP,
         IDS_NOTIFICATION_PERMISSIONS_BLOCKED_CHIP,
         IDS_PERMISSIONS_PERMISSION_ALLOWED_CONFIRMATION,
         IDS_PERMISSIONS_PERMISSION_NOT_ALLOWED_CONFIRMATION,
         IDS_PERMISSIONS_NOTIFICATION_ALLOWED_CONFIRMATION_SCREENREADER_ANNOUNCEMENT,
         IDS_PERMISSIONS_NOTIFICATION_NOT_ALLOWED_CONFIRMATION_SCREENREADER_ANNOUNCEMENT}},
       {RequestType::kVrSession,
        {IDS_VR_PERMISSION_CHIP, -1, -1, -1, -1, -1}}});

  auto messages = kMessageIds->find(request_type_);
  if (messages != kMessageIds->end() && messages->second[type] != -1)
    return l10n_util::GetStringUTF16(messages->second[type]);

  return absl::nullopt;
}

std::u16string PermissionRequest::GetMessageTextFragment() const {
  int message_id = 0;
  switch (request_type_) {
    case RequestType::kAccessibilityEvents:
      message_id = IDS_ACCESSIBILITY_EVENTS_PERMISSION_FRAGMENT;
      break;
    case RequestType::kArSession:
      message_id = IDS_AR_PERMISSION_FRAGMENT;
      break;
    case RequestType::kCameraPanTiltZoom:
      message_id = IDS_MEDIA_CAPTURE_CAMERA_PAN_TILT_ZOOM_PERMISSION_FRAGMENT;
      break;
    case RequestType::kCameraStream:
      message_id = IDS_MEDIA_CAPTURE_VIDEO_ONLY_PERMISSION_FRAGMENT;
      break;
    case RequestType::kClipboard:
      message_id = IDS_CLIPBOARD_PERMISSION_FRAGMENT;
      break;
    case RequestType::kDiskQuota:
      message_id = IDS_REQUEST_QUOTA_PERMISSION_FRAGMENT;
      break;
    case RequestType::kLocalFonts:
      message_id = IDS_FONT_ACCESS_PERMISSION_FRAGMENT;
      break;
    case RequestType::kGeolocation:
      message_id = IDS_GEOLOCATION_INFOBAR_PERMISSION_FRAGMENT;
      break;
    case RequestType::kIdleDetection:
      message_id = IDS_IDLE_DETECTION_PERMISSION_FRAGMENT;
      break;
    case RequestType::kMicStream:
      message_id = IDS_MEDIA_CAPTURE_AUDIO_ONLY_PERMISSION_FRAGMENT;
      break;
    case RequestType::kMidiSysex:
      message_id = IDS_MIDI_SYSEX_PERMISSION_FRAGMENT;
      break;
    case RequestType::kMultipleDownloads:
      message_id = IDS_MULTI_DOWNLOAD_PERMISSION_FRAGMENT;
      break;
    case RequestType::kNotifications:
      message_id = IDS_NOTIFICATION_PERMISSIONS_FRAGMENT;
      break;
#if BUILDFLAG(IS_CHROMEOS) || BUILDFLAG(IS_WIN)
    case RequestType::kProtectedMediaIdentifier:
      message_id = IDS_PROTECTED_MEDIA_IDENTIFIER_PERMISSION_FRAGMENT;
      break;
#endif
    case RequestType::kRegisterProtocolHandler:
      // Handled by an override in `RegisterProtocolHandlerPermissionRequest`.
      NOTREACHED();
      return std::u16string();
    case RequestType::kStorageAccess:
    case RequestType::kTopLevelStorageAccess:
      message_id = IDS_STORAGE_ACCESS_PERMISSION_FRAGMENT;
      break;
    case RequestType::kSecurityAttestation:
      message_id = IDS_SECURITY_KEY_ATTESTATION_PERMISSION_FRAGMENT;
      break;
    case RequestType::kU2fApiRequest:
      message_id = IDS_U2F_API_PERMISSION_FRAGMENT;
      break;
    case RequestType::kVrSession:
      message_id = IDS_VR_PERMISSION_FRAGMENT;
      break;
    case RequestType::kWindowManagement:
      message_id = IDS_WINDOW_MANAGEMENT_PERMISSION_FRAGMENT;
      break;
  }
  DCHECK_NE(0, message_id);
  return l10n_util::GetStringUTF16(message_id);
}

#endif


}  // namespace permissions
