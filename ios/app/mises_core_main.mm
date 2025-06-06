/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#import "mises/ios/app/mises_core_main.h"

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#include "base/compiler_specific.h"
#include "base/files/file_path.h"
#include "base/i18n/icu_util.h"
#include "base/logging.h"
#include "base/apple/bundle_locations.h"
#include "base/apple/foundation_util.h"
#include "base/memory/ref_counted.h"
#include "base/memory/scoped_refptr.h"
#include "base/path_service.h"
#include "base/strings/sys_string_conversions.h"
#include "mises/ios/buildflags.h"
#include "mises/components/mises_component_updater/browser/mises_on_demand_updater.h"
#include "mises/components/brave_wallet/browser/wallet_data_files_installer.h"
#include "mises/ios/app/mises_main_delegate.h"
#include "mises/ios/browser/api/bookmarks/brave_bookmarks_api+private.h"
#include "mises/ios/browser/api/brave_wallet/brave_wallet_api+private.h"
#include "mises/ios/browser/api/history/brave_history_api+private.h"
#include "mises/ios/browser/api/ipfs/ipfs_api+private.h"
#include "mises/ios/browser/api/opentabs/brave_opentabs_api+private.h"
#include "mises/ios/browser/api/opentabs/brave_sendtab_api+private.h"
#include "mises/ios/browser/api/opentabs/brave_tabgenerator_api+private.h"
#include "mises/ios/browser/api/password/brave_password_api+private.h"
#include "mises/ios/browser/api/web_image/web_image+private.h"
#include "mises/ios/browser/brave_web_client.h"
#include "mises/ios/browser/component_updater/component_updater_utils.h"
#include "components/component_updater/component_updater_paths.h"
#include "components/component_updater/installer_policies/safety_tips_component_installer.h"
#include "components/history/core/browser/history_service.h"
#include "components/keyed_service/core/service_access_type.h"
#include "components/password_manager/core/browser/password_store.h"
#include "components/prefs/pref_service.h"
#include "components/send_tab_to_self/send_tab_to_self_sync_service.h"
#include "ios/chrome/app/startup/provider_registration.h"
#include "ios/chrome/browser/bookmarks/model/bookmark_undo_service_factory.h"
#include "ios/chrome/browser/bookmarks/model/local_or_syncable_bookmark_model_factory.h"
#include "ios/chrome/browser/history/history_service_factory.h"
#include "ios/chrome/browser/history/web_history_service_factory.h"
#include "ios/chrome/browser/passwords/model/ios_chrome_profile_password_store_factory.h"
#include "ios/chrome/browser/shared/model/application_context/application_context.h"
#include "ios/chrome/browser/shared/model/browser/browser.h"
#include "ios/chrome/browser/shared/model/browser/browser_list.h"
#include "ios/chrome/browser/shared/model/browser/browser_list_factory.h"
#include "ios/chrome/browser/shared/model/browser_state/chrome_browser_state.h"
#include "ios/chrome/browser/shared/model/browser_state/chrome_browser_state_manager.h"
#include "ios/chrome/browser/shared/model/paths/paths.h"
#include "ios/chrome/browser/shared/model/web_state_list/web_state_list.h"
#include "ios/chrome/browser/shared/public/commands/command_dispatcher.h"
#include "ios/chrome/browser/sync/model/send_tab_to_self_sync_service_factory.h"
#include "ios/chrome/browser/sync/model/session_sync_service_factory.h"
#include "ios/chrome/browser/sync/model/sync_service_factory.h"
#include "ios/chrome/browser/ui/webui/chrome_web_ui_ios_controller_factory.h"
#include "ios/public/provider/chrome/browser/overrides/overrides_api.h"
#include "ios/public/provider/chrome/browser/ui_utils/ui_utils_api.h"
#include "ios/web/public/init/web_main.h"
#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "ios/third_party/mises/mises_utils.h"

#define BUILDFLAG_INTERNAL_MISES_P3A_ENABLED() (0)

// Chromium logging is global, therefore we cannot link this to the instance in
// question
static BraveCoreLogHandler _Nullable _logHandler = nil;

const BraveCoreLogSeverity BraveCoreLogSeverityFatal = logging::LOGGING_FATAL;
const BraveCoreLogSeverity BraveCoreLogSeverityError = logging::LOGGING_ERROR;
const BraveCoreLogSeverity BraveCoreLogSeverityWarning =
    logging::LOGGING_WARNING;
const BraveCoreLogSeverity BraveCoreLogSeverityInfo = logging::LOGGING_INFO;
const BraveCoreLogSeverity BraveCoreLogSeverityVerbose =
    logging::LOGGING_VERBOSE;

@interface MisesCoreMain () {
  std::unique_ptr<BraveWebClient> _webClient;
  std::unique_ptr<BraveMainDelegate> _delegate;
  std::vector<std::string> _argv_store;
  std::unique_ptr<const char*[]> _raw_args;
  std::unique_ptr<web::WebMain> _webMain;
#if BUILDFLAG(MISES_CORE_FRAMEWORK)
  std::unique_ptr<Browser> _browser;
  std::unique_ptr<Browser> _otr_browser;
#endif
  BrowserList* _browserList;
  BrowserList* _otr_browserList;
  ChromeBrowserState* _mainBrowserState;
#if BUILDFLAG(MISES_P3A_ENABLED)
  scoped_refptr<p3a::P3AService> _p3a_service;
  scoped_refptr<p3a::HistogramsBraveizer> _histogram_braveizer;
#endif
}
@property(nonatomic) BraveBookmarksAPI* bookmarksAPI;
@property(nonatomic) BraveHistoryAPI* historyAPI;
@property(nonatomic) BravePasswordAPI* passwordAPI;
@property(nonatomic) BraveOpenTabsAPI* openTabsAPI;
@property(nonatomic) BraveSendTabAPI* sendTabAPI;
//@property(nonatomic) BraveSyncAPI* syncAPI;
//@property(nonatomic) BraveSyncProfileServiceIOS* syncProfileService;
@property(nonatomic) BraveTabGeneratorAPI* tabGeneratorAPI;
@property(nonatomic) WebImageDownloader* webImageDownloader;
@property(nonatomic) BraveWalletAPI* braveWalletAPI;
@property(nonatomic) IpfsAPIImpl* ipfsAPI;
@end

@implementation MisesCoreMain

- (instancetype)initWithUserAgent:(NSString*)userAgent {
  return [self initWithUserAgent:userAgent additionalSwitches:@[]];
}

- (instancetype)initWithUserAgent:(NSString*)userAgent
               additionalSwitches:
                   (NSArray<BraveCoreSwitch*>*)additionalSwitches {
  if ((self = [super init])) {
    [[NSNotificationCenter defaultCenter]
        addObserver:self
           selector:@selector(onAppEnterBackground:)
               name:UIApplicationDidEnterBackgroundNotification
             object:nil];
    [[NSNotificationCenter defaultCenter]
        addObserver:self
           selector:@selector(onAppEnterForeground:)
               name:UIApplicationWillEnterForegroundNotification
             object:nil];
    [[NSNotificationCenter defaultCenter]
        addObserver:self
           selector:@selector(onAppWillTerminate:)
               name:UIApplicationWillTerminateNotification
             object:nil];

    @autoreleasepool {
#if BUILDFLAG(MISES_CORE_FRAMEWORK)
      ios::RegisterPathProvider();
#endif

      // // Bundled components are not supported on ios, so DIR_USER_DATA is passed
      // // for all three arguments.
      // component_updater::RegisterPathProvider(
      //     ios::DIR_USER_DATA, ios::DIR_USER_DATA, ios::DIR_USER_DATA);
    }

    NSBundle* baseBundle = base::apple::OuterBundle();
    base::apple::SetBaseBundleID(
        base::SysNSStringToUTF8([baseBundle bundleIdentifier]).c_str());

    // Register all providers before calling any Chromium code.
    [ProviderRegistration registerProviders];
#if BUILDFLAG(MISES_CORE_FRAMEWORK)
    // Setup WebClient ([ClientRegistration registerClients])
    _webClient.reset(new BraveWebClient());
    _webClient->SetUserAgent(base::SysNSStringToUTF8(userAgent));
    web::SetWebClient(_webClient.get());
#endif

    _delegate.reset(new BraveMainDelegate());

    // Start Main ([ChromeMainStarter startChromeMain])
    web::WebMainParams params(_delegate.get());

    // Parse Switches, Features, Arguments (Command-Line Arguments)
    NSMutableArray* arguments =
        [[[NSProcessInfo processInfo] arguments] mutableCopy];
    NSMutableArray* switches = [[NSMutableArray alloc] init];
    for (BraveCoreSwitch* sv in additionalSwitches) {
      if (!sv.value) {
        [switches addObject:[NSString stringWithFormat:@"--%@", sv.key]];
      } else {
        [switches
            addObject:[NSString stringWithFormat:@"--%@=%@", sv.key, sv.value]];
      }
    }
    [arguments addObjectsFromArray:switches];
    params.argc = [arguments count];

    // Allocate memory to convert from iOS arguments to Native arguments
    _raw_args.reset(new const char*[params.argc]);
    _argv_store.resize([arguments count]);

    for (NSUInteger i = 0; i < [arguments count]; i++) {
      _argv_store[i] = base::SysNSStringToUTF8([arguments objectAtIndex:i]);
      _raw_args[i] = _argv_store[i].c_str();
    }
    params.argv = _raw_args.get();
  #if !BUILDFLAG(MISES_CORE_FRAMEWORK)
    params.register_exit_manager = false;
  #endif
  #if BUILDFLAG(MISES_CORE_FRAMEWORK)
    // Setup WebMain
    _webMain = std::make_unique<web::WebMain>(std::move(params));
  #endif


    // Initialize and set the main browser state.
    ios::ChromeBrowserStateManager* browserStateManager =
        GetApplicationContext()->GetChromeBrowserStateManager();
    ChromeBrowserState* chromeBrowserState =
        browserStateManager->GetLastUsedBrowserState();
    _mainBrowserState = chromeBrowserState;

    // Setup main browser
    _browserList = BrowserListFactory::GetForBrowserState(_mainBrowserState);
  #if BUILDFLAG(MISES_CORE_FRAMEWORK)
    _browser = Browser::Create(_mainBrowserState);
    _browserList->AddBrowser(_browser.get());
  #endif

    // Setup otr browser
    ChromeBrowserState* otrChromeBrowserState =
        chromeBrowserState->GetOffTheRecordChromeBrowserState();
    _otr_browserList =
        BrowserListFactory::GetForBrowserState(otrChromeBrowserState);
  #if BUILDFLAG(MISES_CORE_FRAMEWORK)
    _otr_browser = Browser::Create(otrChromeBrowserState);
    _otr_browserList->AddIncognitoBrowser(_otr_browser.get());
    
  #endif

    // Initialize the provider UI global state.
    ios::provider::InitializeUI();

    // Setup WebUI (Sync Internals and other WebViews)
    web::WebUIIOSControllerFactory::RegisterFactory(
        ChromeWebUIIOSControllerFactory::GetInstance());

    // Setup Component Updater
    component_updater::ComponentUpdateService* cus =
        GetApplicationContext()->GetComponentUpdateService();
    DCHECK(cus);

    //_adblockService = [[AdblockService alloc] initWithComponentUpdater:cus];
    [self registerComponentsForUpdate:cus];
  }
  return self;
}

- (void)dealloc {
  _bookmarksAPI = nil;
  _historyAPI = nil;
  _openTabsAPI = nil;
  _passwordAPI = nil;
  _sendTabAPI = nil;
  //_syncProfileService = nil;
  //_syncAPI = nil;
  _tabGeneratorAPI = nil;
  _webImageDownloader = nil;
 #if BUILDFLAG(MISES_CORE_FRAMEWORK)
  _otr_browserList =
      BrowserListFactory::GetForBrowserState(_otr_browser->GetBrowserState());
  [_otr_browser->GetCommandDispatcher() prepareForShutdown];
  _otr_browserList->RemoveBrowser(_otr_browser.get());
  _otr_browser->GetWebStateList()->CloseAllWebStates(
      WebStateList::CLOSE_NO_FLAGS);
  _otr_browser.reset();

  _browserList =
      BrowserListFactory::GetForBrowserState(_browser->GetBrowserState());
  [_browser->GetCommandDispatcher() prepareForShutdown];
  _browserList->RemoveBrowser(_browser.get());
  _browser->GetWebStateList()->CloseAllWebStates(WebStateList::CLOSE_NO_FLAGS);
  _browser.reset();
  #endif

  _mainBrowserState = nullptr;
  _webMain.reset();
  _raw_args.reset();
  _argv_store = {};
  _delegate.reset();
  _webClient.reset();

  VLOG(1) << "Terminated Brave-Core";
}

- (void)onAppEnterBackground:(NSNotification*)notification {
  auto* context = GetApplicationContext();
  if (context) {
    context->OnAppEnterBackground();
    // Since we don't use the WebViewWebMainParts, local state is never commited
    // on app background
    context->GetLocalState()->CommitPendingWrite();
  }
}

- (void)onAppEnterForeground:(NSNotification*)notification {
  auto* context = GetApplicationContext();
  if (context)
    context->OnAppEnterForeground();
}

- (void)onAppWillTerminate:(NSNotification*)notification {
  // ApplicationContextImpl doesn't get teardown call at the moment because we
  // cannot dealloc this class yet without crashing.
  auto* context = GetApplicationContext();
  if (context && context->GetLocalState()) {
    context->GetLocalState()->CommitPendingWrite();
  }
  
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)scheduleLowPriorityStartupTasks {
  // Install overrides
  ios::provider::InstallOverrides();

  // Make sure the system url request getter is called at least once during
  // startup in case cleanup is done early before first network request
  GetApplicationContext()->GetSystemURLRequestContext();
}

- (void)registerComponentsForUpdate:
    (component_updater::ComponentUpdateService*)cus {
  mises_component_updater::MisesOnDemandUpdater::GetInstance()
      ->RegisterOnDemandUpdateCallback(
          base::BindRepeating(&component_updater::MisesOnDemandUpdate));

  RegisterSafetyTipsComponent(cus);
  brave_wallet::RegisterWalletDataFilesComponent(cus);

  //[self.adblockService registerDefaultShieldsComponent];
}

+ (void)setLogHandler:(BraveCoreLogHandler)logHandler {
  _logHandler = logHandler;
  logging::SetLogMessageHandler(&CustomLogHandler);
}

static bool CustomLogHandler(int severity,
                             const char* file,
                             int line,
                             size_t message_start,
                             const std::string& str) {
  if (!_logHandler) {
    return false;
  }
  const int vlog_level = logging::GetVlogLevelHelper(file, strlen(file));
  if (severity <= vlog_level || severity == logging::LOGGING_FATAL) {
    return _logHandler(severity, base::SysUTF8ToNSString(file), line,
                       message_start, base::SysUTF8ToNSString(str));
  }
  return true;
}

#pragma mark -

- (BraveBookmarksAPI*)bookmarksAPI {
  if (!_bookmarksAPI) {
    bookmarks::BookmarkModel* bookmark_model_ =
        ios::LocalOrSyncableBookmarkModelFactory::GetForBrowserState(_mainBrowserState);
    BookmarkUndoService* bookmark_undo_service_ =
        ios::BookmarkUndoServiceFactory::GetForBrowserState(_mainBrowserState);

    _bookmarksAPI = [[BraveBookmarksAPI alloc]
        initWithBookmarkModel:bookmark_model_
          bookmarkUndoService:bookmark_undo_service_];
  }
  return _bookmarksAPI;
}

- (BraveHistoryAPI*)historyAPI {
  if (!_historyAPI) {
    history::HistoryService* history_service_ =
        ios::HistoryServiceFactory::GetForBrowserState(
            _mainBrowserState, ServiceAccessType::EXPLICIT_ACCESS);
    history::WebHistoryService* web_history_service_ =
        ios::WebHistoryServiceFactory::GetForBrowserState(_mainBrowserState);

    _historyAPI =
        [[BraveHistoryAPI alloc] initWithHistoryService:history_service_
                                      webHistoryService:web_history_service_];
  }
  return _historyAPI;
}

- (BraveOpenTabsAPI*)openTabsAPI {
  if (!_openTabsAPI) {
    syncer::SyncService* sync_service_ =
        SyncServiceFactory::GetForBrowserState(_mainBrowserState);

    sync_sessions::SessionSyncService* session_sync_service_ =
        SessionSyncServiceFactory::GetForBrowserState(_mainBrowserState);

    _openTabsAPI =
        [[BraveOpenTabsAPI alloc] initWithSyncService:sync_service_
                                   sessionSyncService:session_sync_service_];
  }
  return _openTabsAPI;
}

- (BravePasswordAPI*)passwordAPI {
  if (!_passwordAPI) {
    scoped_refptr<password_manager::PasswordStoreInterface> password_store_ =
        IOSChromeProfilePasswordStoreFactory::GetForBrowserState(
            _mainBrowserState, ServiceAccessType::EXPLICIT_ACCESS)
            .get();

    _passwordAPI =
        [[BravePasswordAPI alloc] initWithPasswordStore:password_store_];
  }
  return _passwordAPI;
}

- (BraveSendTabAPI*)sendTabAPI {
  if (!_sendTabAPI) {
    send_tab_to_self::SendTabToSelfSyncService* sync_service_ =
        SendTabToSelfSyncServiceFactory::GetForBrowserState(_mainBrowserState);

    _sendTabAPI = [[BraveSendTabAPI alloc] initWithSyncService:sync_service_];
  }
  return _sendTabAPI;
}

// - (BraveSyncAPI*)syncAPI {
//   if (!_syncAPI) {
//     _syncAPI = [[BraveSyncAPI alloc] initWithBrowserState:_mainBrowserState];
//   }
//   return _syncAPI;
// }

// - (BraveSyncProfileServiceIOS*)syncProfileService {
//   if (!_syncProfileService) {
//     syncer::SyncService* sync_service_ =
//         SyncServiceFactory::GetForBrowserState(_mainBrowserState);
//     _syncProfileService = [[BraveSyncProfileServiceIOS alloc]
//         initWithProfileSyncService:sync_service_];
//   }
//   return _syncProfileService;
// }

- (BraveTabGeneratorAPI*)tabGeneratorAPI {
   Browser *browser;
  #if BUILDFLAG(MISES_CORE_FRAMEWORK)
    browser = _browser.get();
  #else
    std::set<Browser*> browsers = _browserList->AllRegularBrowsers();
    if (browsers.size() > 0) {
      browser = *browsers.begin();
    }
  #endif
  if (!_tabGeneratorAPI && browser) {
    _tabGeneratorAPI =
        [[BraveTabGeneratorAPI alloc] initWithBrowser:browser];
  }
  return _tabGeneratorAPI;
}

- (WebImageDownloader*)webImageDownloader {
  Browser *browser;
  #if BUILDFLAG(MISES_CORE_FRAMEWORK)
    browser = _otr_browser.get();
  #else
    std::set<Browser*> otr_browsers = _otr_browserList->AllRegularBrowsers();
    if (otr_browsers.size() > 0) {
      browser = *otr_browsers.begin();
    }
    
  #endif
  if (!_webImageDownloader && browser) {
    _webImageDownloader = [[WebImageDownloader alloc]
        initWithBrowserState:browser->GetBrowserState()];
  }
  return _webImageDownloader;
}

- (BraveWalletAPI*)braveWalletAPI {
  if (!_braveWalletAPI) {
    _braveWalletAPI =
        [[BraveWalletAPI alloc] initWithBrowserState:_mainBrowserState];
  }
  return _braveWalletAPI;
}

// - (BraveStats*)braveStats {
//   return [[BraveStats alloc] initWithBrowserState:_mainBrowserState];
// }

- (id<IpfsAPI>)ipfsAPI {
  if (!_ipfsAPI) {
    _ipfsAPI = [[IpfsAPIImpl alloc] initWithBrowserState:_mainBrowserState];
  }
  return _ipfsAPI;
}

- (void)initializeP3AServiceForChannel:(NSString*)channel
                         weekOfInstall:(NSString*)weekOfInstall {
#if BUILDFLAG(MISES_P3A_ENABLED)
  _p3a_service = base::MakeRefCounted<p3a::P3AService>(
      GetApplicationContext()->GetLocalState(),
      base::SysNSStringToUTF8(channel), base::SysNSStringToUTF8(weekOfInstall),
      p3a::P3AConfig::LoadFromCommandLine());
  _p3a_service->InitCallbacks();
  _p3a_service->Init(GetApplicationContext()->GetSharedURLLoaderFactory());
  _histogram_braveizer = p3a::HistogramsBraveizer::Create();
#endif  // BUILDFLAG(MISES_P3A_ENABLED)
}

-(NSUInteger) activeWebviewId {
  return mises::activeWebviewId();
}

- (void)setMisesId:(NSString*)misesId withAuth:(NSString*) auth {
  [[Mises account] setMisesId:misesId withAuth:auth];
}

// - (BraveP3AUtils*)p3aUtils {
//   return [[BraveP3AUtils alloc]
//       initWithBrowserState:_mainBrowserState
//                 localState:GetApplicationContext()->GetLocalState()];
// }

+ (bool)initializeICUForTesting {
  NSBundle* bundle = [NSBundle bundleForClass:self];
  base::apple::SetOverrideOuterBundle(bundle);
  base::apple::SetOverrideFrameworkBundle(bundle);
  return base::i18n::InitializeICU();
}

@end
