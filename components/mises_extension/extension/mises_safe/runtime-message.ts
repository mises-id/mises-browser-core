export abstract class Message<R> {
  /**
   * It is needed to infer the type of result from messaging in order to use message with easy and safe type checking.
   * However, typescript doesn't infer the type of result if generic R is not used in structure due to its structural typing system.
   * So, we need to use generic R though there is no need to use generic R in structure.
   * This is just dummy field for generic R, and actually it is never used.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  protected _: R;

  /**
   * ValidateBasic does a simple validation check that
   * doesn't require access to any other information.
   * You can throw error in this when msg is invalid.
   */
  abstract validateBasic(): void;
  abstract route(): string;
  abstract type(): string;

  /**
   * This means where the message is sent from.
   * Sending logic should set this value.
   * And, message manager should check that this origin is set properly.
   */
  public readonly origin!: string;

  /**
   * You can put values here that can be helpful when processing in the router.
   * In logic, these values should not be used.
   */
  public routerMeta?: Record<string, any>;

}

export const ROUTE = "mises-safe";

export class InitSafeMsg extends Message<void> {
  public static type() {
    return "init-mises-safe";
  }

  constructor(public readonly state: boolean) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  validateBasic(): void {
    
  }

  route(): string {
    return ROUTE;
  }

  type(): string {
    return InitSafeMsg.type();
  }
}

export class MessageRegistry {
  private registeredMsgType: Map<
    string,
    { new (): Message<unknown> }
  > = new Map();

  registerMessage(
    msgCls: { new (...args: any): Message<unknown> } & { type(): string }
  ): void {
    if (this.registeredMsgType.has(msgCls.type())) {
      throw new Error(`Already registered type ${msgCls.type()}`);
    }

    this.registeredMsgType.set(msgCls.type(), msgCls);
  }

  parseMessage(message: { type?: string; msg: any }): Message<unknown> {
    if (!message.type) {
      throw new Error("Null type");
    }

    const msgCls = this.registeredMsgType.get(message.type);
    if (!msgCls) {
      throw new Error(`Unregistered msg type ${message.type}`);
    }
    return Object.setPrototypeOf(
      message.msg,
      msgCls.prototype
    ) as Message<unknown>;
  }
}


export class MisesProxyRequestMsg extends Message<any> {
  public static type() {
    return "mises-proxy-request";
  }

  constructor(public readonly params: any) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  validateBasic(): void {
    // noop
  }

  route(): string {
    return ROUTE;
  }

  approveExternal(): boolean {
    return true;
  }

  type(): string {
    return MisesProxyRequestMsg.type();
  }
}
export class GetIsShouldVerifyMsg extends Message<boolean> {
  public static type() {
    return "get-is-should-verify";
  }

  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  validateBasic(): void {
    // noop
  }

  route(): string {
    return ROUTE;
  }

  approveExternal(): boolean {
    return true;
  }

  type(): string {
    return GetIsShouldVerifyMsg.type();
  }
}

export class SetIsShouldVerifyMsg extends Message<void> {
  public static type() {
    return "set-is-should-verify";
  }

  constructor(public readonly state: boolean) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  validateBasic(): void {
    // noop
  }

  route(): string {
    return ROUTE;
  }

  approveExternal(): boolean {
    return true;
  }

  type(): string {
    return SetIsShouldVerifyMsg.type();
  }
}