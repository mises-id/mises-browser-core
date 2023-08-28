import * as React from "react";
import { FunctionComponent, useState } from "react";
import { SettingItem } from "../components";
import { Toggle } from "../../../components/toggle";
import delay from "delay";
import { PasswordInputModal } from "../../../modals/password-input/modal";

export const SettingBiometricLockItem: FunctionComponent<{
  topBorder?: boolean;
}> = ({ topBorder }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  /*
    isTurnOffBiometryFallback indicates that the modal is for turning off the biometry
    when failing to check the password to turn off by the biometry.
    This is mainly used to give the chance to the user when the biometry information changed after turning on the biometry sign-in.
   */
  const [isTurnOffBiometryFallback, setIsTurnOffBiometryFallback] =
    useState(false);

  const [isBiometryOn, setisBiometryOn] = useState(false);
  return (
    <React.Fragment>
      <PasswordInputModal
        title={
          !isTurnOffBiometryFallback
            ? "Enable Biometric Authentication"
            : "Disable Biometric Authentication"
        }
        isOpen={isOpenModal}
        close={() => {
          setIsOpenModal(false);
          setIsTurnOffBiometryFallback(false);
        }}
        onEnterPassword={async (password) => {
          // Because javascript is synchronous language, the loadnig state change would not delivered to the UI thread
          // So to make sure that the loading state changes, just wait very short time.
          await delay(10);

          // if (!isTurnOffBiometryFallback) {
          //   await keychainStore.turnOnBiometry(password);
          // } else {
          //   await keychainStore.turnOffBiometryWithPassword(password);
          // }
        }}
      />
      <SettingItem
        label="Use biometric authentication"
        right={
          <Toggle
            on={isBiometryOn}
            onChange={async (value) => {
              if (value) {
                setIsOpenModal(true);
                setIsTurnOffBiometryFallback(false);
              } else {
                try {
                  setisBiometryOn(true);
                  // await keychainStore.turnOffBiometry();
                } catch (e) {
                  console.log(e);
                  setIsOpenModal(true);
                  setIsTurnOffBiometryFallback(true);
                }
              }
            }}
          />
        }
        topBorder={topBorder}
      />
    </React.Fragment>
  );
};
