import Foundation
import UIKit

import mises_wallet_framwork

var wpm: WalletPanelManager?

extension UIViewController {
    @objc public func popupWallet() {
        if wpm == nil {
            wpm = WalletPanelManager()
        }
        wpm?.presentWallet(from: self)
    }
}
