#ifndef THIRD_PARTY_BLINK_RENDERER_MODULES_WEBGL_GPU_FINGERPRINT_H_
#define THIRD_PARTY_BLINK_RENDERER_MODULES_WEBGL_GPU_FINGERPRINT_H_

#include <string>

namespace blink {

// Returns the GL_VENDOR string based on platform and fingerprint
std::string GetGLVendorStringForFingerprint();

// Returns the GL_RENDERER string based on platform and fingerprint
std::string GetGLRendererStringForFingerprint();

bool GLFingerprintEnabled();

}  // namespace blink

#endif  // THIRD_PARTY_BLINK_RENDERER_MODULES_WEBGL_GPU_FINGERPRINT_H_