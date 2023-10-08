import { useState } from "react";
import { toGenerator } from "../../../common";

export type NewMnemonicMode = "generate" | "verify";

export enum NumWords {
  WORDS12,
  WORDS24,
}

export class NewMnemonicConfig {
  protected _mode: NewMnemonicMode = "generate";

  protected _numWords: NumWords = NumWords.WORDS12;

  protected _mnemonic: string = "";

  protected _name: string = "";

  protected _password: string = "";

  constructor(protected readonly registerConfig: any) {

    this.setNumWords(this.numWords);
  }

  get mode(): NewMnemonicMode {
    return this._mode;
  }

  setMode(mode: NewMnemonicMode) {
    this._mode = mode;
  }

  get numWords(): NumWords {
    return this._numWords;
  }

  *setNumWords(numWords: NumWords) {
    this._numWords = numWords;
    if (numWords === NumWords.WORDS12) {
      this._mnemonic = yield* toGenerator(
        this.registerConfig.generateMnemonic(128)
      );
    } else if (numWords === NumWords.WORDS24) {
      this._mnemonic = yield* toGenerator(
        this.registerConfig.generateMnemonic(256)
      );
    }
  }

  get mnemonic(): string {
    return this._mnemonic;
  }

  setMnemonic(mnemonic: string) {
    this._mnemonic = mnemonic;
  }

  get name(): string {
    return this._name;
  }

  setName(name: string) {
    this._name = name;
  }

  get password(): string {
    return this._password;
  }

  setPassword(password: string) {
    this._password = password;
  }
}

export const useNewMnemonicConfig = (registerConfig: any) => {
  const [newMnemonicConfig] = useState(
    () => new NewMnemonicConfig(registerConfig)
  );

  return newMnemonicConfig;
};
