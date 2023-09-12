import * as React from "react";
import { FunctionComponent, useState } from "react";
import { Text } from "react-native";
import { useStyle } from "../../styles";
import { CardModal } from "../card";
import { TextInput } from "../../components/input";
import { Button } from "../../components/button";
import { useApiProxy } from "../../../common/hooks/use-api-proxy";

export const LockTimeInputModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  title: string;
  paragraph?: string;
  /**
   * If any error thrown in the `onEnterPassword`, the password considered as invalid password.
   * @param password
   */
  onEnter: (password: string) => Promise<void>;
}> = ({ close, title, paragraph, onEnter, isOpen }) => {
  const style = useStyle();
  const { keyringService } = useApiProxy()
  const [lockTime, setLockTime] = useState('');
  React.useEffect(() => {
    keyringService.getAutoLockMinutes().then((res: {minutes: number}) => {
      console.log(res.minutes, "keyringService.GetAutoLockMinutes()")
      setLockTime(`${res.minutes}`);
    })
  }, [])
  

  const [isLoading, setIsLoading] = useState(false);

  const submitLockTime = async () => {
    setIsLoading(true);
    try {
      await onEnter(lockTime);
      close();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardModal title={title} isOpen={isOpen} close={close}>
      <Text
        style={style.flatten([
          "body2",
          "color-text-middle",
          "margin-bottom-32",
        ])}
      >
        {paragraph || "Set lock time to continue"}
      </Text>
      <TextInput
        label="Lock Time(minutes)"
        onChangeText={(text: string) => {
          setLockTime(text);
        }}
        value={lockTime}
        returnKeyType="done"
        onSubmitEditing={submitLockTime}
      />
      <Button
        text="Submit"
        size="large"
        loading={isLoading}
        onPress={submitLockTime}
      />
    </CardModal>
  );
}
