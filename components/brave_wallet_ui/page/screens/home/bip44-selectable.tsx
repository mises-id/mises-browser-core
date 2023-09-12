import * as React from "react";
import {FunctionComponent, useState } from "react";
import { LoadingScreenModal } from "../../providers/loading-screen/modal";
import { CardModal } from "../../modals/card";
import { useStyle } from "../../styles/index";
import { Button } from "../../components/button";

export const BIP44Selectable: FunctionComponent = () => {
  const [isSelectorModalShow] = useState(false);
  const needSelectBIP44 = false;

  return (
    <React.Fragment>
      <LoadingScreenModal
        isOpen={needSelectBIP44 && !isSelectorModalShow}
        close={() => {
          // noop
        }}
      />
      <BIP44SelectableModal
        isOpen={needSelectBIP44 && isSelectorModalShow}
        close={() => {
          // noop
        }}
      />
    </React.Fragment>
  );
};

export const BIP44SelectableModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
}> = ({isOpen, close}) => {
  const style = useStyle();
  const [selectedIndex] = useState(-1);

  return (
    <CardModal title="Select your account" disableGesture={true} isOpen={isOpen} close={close}>
      <Button
        size="large"
        text="Select Account"
        containerStyle={style.flatten(["margin-top-12"])}
        disabled={selectedIndex < 0}
        onPress={() => {
          // keyRingStore.setKeyStoreCoinType(
          //   chainStore.current.chainId,
          //   selectables.selectables[selectedIndex].path.coinType
          // );
        }}
      />
    </CardModal>
  );
}
