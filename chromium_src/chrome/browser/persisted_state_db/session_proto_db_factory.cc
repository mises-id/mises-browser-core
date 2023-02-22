
#include "src/chrome/browser/persisted_state_db/session_proto_db_factory.cc"


#if BUILDFLAG(IS_ANDROID)

#include "chrome/browser/cart/cart_db.h"
#include "chrome/browser/commerce/coupons/coupon_db.h"

#include "components/commerce/core/proto/cart_db_content.pb.h"
#include "components/commerce/core/proto/coupon_db_content.pb.h"


template <>
SessionProtoDBFactory<cart_db::ChromeCartContentProto>*
SessionProtoDBFactory<cart_db::ChromeCartContentProto>::GetInstance() {
  return nullptr;
}


template <>
SessionProtoDBFactory<coupon_db::CouponContentProto>*
SessionProtoDBFactory<coupon_db::CouponContentProto>::GetInstance() {
  return nullptr;
}

#endif
