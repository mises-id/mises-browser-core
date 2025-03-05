import * as MisesSafe  from "./service";
import {ExtensionKVStore} from "./store"
import {getHandler} from "./handler"
import {
  GetIsShouldVerifyMsg,
  InitSafeMsg,
  SetIsShouldVerifyMsg,
  MisesProxyRequestMsg,
  MessageRegistry
} from "../runtime-message";
const misesSafeService = new MisesSafe.MisesSafeService(
  new ExtensionKVStore("misesSafe")
);
misesSafeService.init();
const handler = getHandler(misesSafeService);

const msgRegistry: MessageRegistry = new MessageRegistry();
msgRegistry.registerMessage(InitSafeMsg);
msgRegistry.registerMessage(GetIsShouldVerifyMsg);
msgRegistry.registerMessage(SetIsShouldVerifyMsg);
msgRegistry.registerMessage(MisesProxyRequestMsg);

chrome.runtime.onMessage.addListener((message) => {
  let parsedMessage = msgRegistry.parseMessage({ type: message.type , msg: message })
  
  if ( parsedMessage !== null) {
    handler({isInternalMsg: true}, parsedMessage)
  }
  
  
  // Return true to indicate you want to send a response asynchronously
  return true;
});