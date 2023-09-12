import * as React from "react";
import { FunctionComponent, useState } from "react";
import { SettingItem } from "../components";
import { getPrivateDataTitle } from "../screens/view-private-data";
import { useApiProxy } from "../../../../common/hooks/use-api-proxy";
import { LockTimeInputModal } from "../../../../page/modals/lock-time-input/modal";

export const SettingViewSetLockTime: FunctionComponent<{
  topBorder?: boolean;
}> = ({ topBorder }) => {

  const [isOpenModal, setIsOpenModal] = useState(false);
  const { keyringService } = useApiProxy()
  return (
    <React.Fragment>
      <SettingItem
        label={"Auto-lock timer"}
        onPress={() => {
          setIsOpenModal(true);
        }}
        topBorder={topBorder}
      />
      <LockTimeInputModal
        isOpen={isOpenModal}
        close={() => setIsOpenModal(false)}
        title="Auto-lock timer (minutes)"
        onEnter={async (lockTime) => {
          keyringService.setAutoLockMinutes(Number(lockTime))

        }}
      />
    </React.Fragment>
  );
};
