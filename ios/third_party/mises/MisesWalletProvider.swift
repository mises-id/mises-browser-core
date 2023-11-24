import Foundation
import UIKit

import mises_wallet_framwork

var mwapi: MisesWalletApi?

extension UIViewController {
    @objc public func popupWallet() {
        if mwapi == nil {
            mwapi = MisesWalletApi()
        }
        mwapi?.presentWallet(from: self)
    }
}
