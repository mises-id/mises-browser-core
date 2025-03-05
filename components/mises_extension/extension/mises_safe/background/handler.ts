import {
  GetIsShouldVerifyMsg,
  InitSafeMsg,
  SetIsShouldVerifyMsg,
  MisesProxyRequestMsg,
  Message
} from "../runtime-message";
import { MisesSafeService } from "./service";

export interface Env {
  readonly isInternalMsg: boolean;
}

export type Handler = (env: Env, msg: Message<unknown>) => any;
export type InternalHandler<M extends Message<unknown>> = (
  env: Env,
  msg: M
) =>
  | (M extends Message<infer R> ? R : never)
  | Promise<M extends Message<infer R> ? R : never>;

export const getHandler: (service: MisesSafeService) => Handler = (service) => {
  return (env: Env, msg: Message<unknown>) => {
    switch (msg.constructor) {
      case InitSafeMsg:
        return handlerInitSafeMsg(service)(env, msg as InitSafeMsg);
      case MisesProxyRequestMsg:
        return handlerMisesProxyRequestMsg(service)(env, msg as MisesProxyRequestMsg);
      case GetIsShouldVerifyMsg:
        return handlerGetIsShouldVerifyMsg(service)(
          env,
          msg as GetIsShouldVerifyMsg
        );
      case SetIsShouldVerifyMsg:
        return handlerSetIsShouldVerifyMsg(service)(
          env,
          msg as SetIsShouldVerifyMsg
        );
      default:
        throw new Error("Unknown msg type");
    }
  };
};

const handlerInitSafeMsg: (
  service: MisesSafeService
) => InternalHandler<InitSafeMsg> = (service: MisesSafeService) => (_, msg) => {
  service.setIsShouldVerifyState(msg.state);
};

const handlerMisesProxyRequestMsg: (
  service: MisesSafeService
) => InternalHandler<MisesProxyRequestMsg> = (service: MisesSafeService) => (
  _,
  msg
) => {
  return service.initMessageClient(msg);
};

const handlerGetIsShouldVerifyMsg: (
  service: MisesSafeService
) => InternalHandler<GetIsShouldVerifyMsg> = (service: MisesSafeService) => (
  _
) => {
  return service.isShouldVerify;
};

const handlerSetIsShouldVerifyMsg: (
  service: MisesSafeService
) => InternalHandler<SetIsShouldVerifyMsg> = (service: MisesSafeService) => (
  _,
  msg
) => {
  return service.setIsShouldVerifyState(msg.state);
};
