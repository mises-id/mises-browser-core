import * as React from "react";
import { FunctionComponent, useState } from "react";
import { Text } from "react-native";
import { useStyle } from "../../styles";
import { CardModal } from "../card";
import { TextInput } from "../../components/input";
import { Button } from "../../components/button";

export const PasswordInputModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  title: string;
  paragraph?: string;
  /**
   * If any error thrown in the `onEnterPassword`, the password considered as invalid password.
   * @param password
   */
  onEnterPassword: (password: string) => Promise<void>;
}> = ({ close, title, paragraph, onEnterPassword, isOpen }) => {
  const style = useStyle();

  const [password, setPassword] = useState("");
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const submitPassword = async () => {
    setIsLoading(true);
    try {
      await onEnterPassword(password);
      setIsInvalidPassword(false);
      close();
    } catch (e) {
      console.log(e);
      setIsInvalidPassword(true);
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
        {paragraph || "Enter your password to continue"}
      </Text>
      <TextInput
        label="Password"
        error={isInvalidPassword ? "Invalid password" : undefined}
        onChangeText={(text: string) => {
          setPassword(text);
        }}
        value={password}
        returnKeyType="done"
        secureTextEntry={true}
        onSubmitEditing={submitPassword}
      />
      <Button
        text="Approve"
        size="large"
        loading={isLoading}
        onPress={submitPassword}
      />
    </CardModal>
  );
}
