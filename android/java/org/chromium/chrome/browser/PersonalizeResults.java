package org.chromium.chrome.browser;

import org.chromium.base.Log;
import org.chromium.url.GURL;
import org.chromium.base.ContextUtils;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.content_public.browser.WebContents;
import org.chromium.chrome.browser.tab.RequestDesktopUtils;
import org.chromium.chrome.browser.preferences.Pref;

import java.net.URL;
import java.net.MalformedURLException;

public class PersonalizeResults {
    public static void SetupDefaultUserAgent(final Profile profile) {
      String [] urlUseDesktop = new String [] {
          "https://www.aptosnames.com",
          "https://app.arcade.xyz/loans",
          "https://gm.xyz",
          "https://link3.to",
          "https://chartex.pro",
          "https://app.slingshot.finance",
          "https://bridge.terra.money"
      };
      for (int i = 0; i < urlUseDesktop.length; i++) {
        final GURL url = new GURL(urlUseDesktop[i]);
        RequestDesktopUtils.setRequestDesktopSiteContentSettingsForUrl(profile, url, true);
      }
    }
    public static void Execute(final GURL url, final WebContents webContents) {
        if (url == null || webContents == null) {
          return;
        }
        final boolean shouldRewrapText = ContextUtils.getAppSharedPreferences().getBoolean("text_rewrap", false);
        final boolean shouldRemoveAmp = ContextUtils.getAppSharedPreferences().getBoolean("avoid_amp_websites", true);
        if (shouldRemoveAmp &&  IsSearchUrl(url.getSpec())) {
            webContents.evaluateJavaScript(AMP_SCRIPT, null);
        }
        if ( shouldRewrapText) {
            webContents.evaluateJavaScript("(function() { var pendingUpdate=false;function viewportHandler(event){if(pendingUpdate)return;pendingUpdate=true;requestAnimationFrame(()=>{pendingUpdate=false;document.getElementsByTagName('html')[0].style.maxWidth=window.visualViewport.width+'px';var miniLeft=visualViewport.offsetLeft;var miniTop = -(visualViewport.offsetTop + visualViewport.offsetTop * ((window.pageYOffset / window.innerHeight) / 2));document.getElementsByTagName('html')[0].style.transition='0s ease-in-out';if (miniLeft == 0 && miniTop == 0) { document.getElementsByTagName('html')[0].style.transform=''; } else { document.getElementsByTagName('html')[0].style.transform='translate('+miniLeft+'px, '+miniTop+'px) scale(1.0)'; } })}window.visualViewport.addEventListener('resize',viewportHandler);window.visualViewport.addEventListener('scroll', viewportHandler); })();", null);
        }
        if (url.getSpec().startsWith("https://chrome.google.com/webstore")) {
            webContents.evaluateJavaScript("(function() { if (!document.location.href.includes('https://chrome.google.com/webstore')) { return; } " + MAKE_USER_AGENT_WRITABLE + " window.navigator.userAgent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.24 Safari/537.36'; window.addEventListener('load', function() { if (document.location.pathname == '/webstore/unsupported') { document.location = '/webstore/'; } var node = document.createElement('style');    document.body.appendChild(node);    window.addStyleString = function(str) {        node.innerHTML = str;    }; addStyleString('div { visibility: visible !important; } '); }); })();", null);
        }
        if (url.getSpec().startsWith("https://chrome.google.com/webstore")) {
            webContents.evaluateJavaScript("(function() { if (!document.location.href.includes('https://chrome.google.com/webstore')) { return; } window.addEventListener('DOMContentLoaded', function() { var t=document.querySelector('meta[name=\"viewport\"]');t&&(t.content=\"initial-scale=0.1\",t.content=\"width=1200\") }); })();", null);
        }
        if (url.getSpec().startsWith("https://chromewebstore.google.com")) {
            webContents.evaluateJavaScript("(function() { if (!document.location.href.includes('https://chromewebstore.google.com')) { return; } window.addEventListener('DOMContentLoaded', function() { var t=document.querySelector('meta[name=\"viewport\"]');t&&(t.content=\"initial-scale=0.1\",t.content=\"width=1200\") }); })();", null);
        }
        if (url.getSpec().startsWith("https://microsoftedge.microsoft.com/addons")) {
            webContents.evaluateJavaScript(EDGE_SCRIPT, null);
        }
        if ( (url.getSpec().startsWith("https://m.facebook.com/messenger/install")
                        ||url.getSpec().startsWith("https://m.facebook.com/messages"))) {
            webContents.evaluateJavaScript(MESSENGER_SCRIPT, null);
        }
        if (url.getSpec().contains("messenger.com/")) {
            webContents.evaluateJavaScript(MESSENGER_VIEWPORT_SCRIPT, null);
        }
        if (url.getSpec().startsWith("https://m.facebook.com/")) {
            webContents.evaluateJavaScript("(function(){ if (!document.location.href.includes('https://m.facebook.com/')) { return; } document.querySelector('body.touch').style = \"cursor:default\";})();", null);
        }
        if (url.getSpec().startsWith("https://translate.google.com/translate_c")) {
            webContents.evaluateJavaScript("(function(){ if (!document.location.href.includes('https://translate.google.com/translate_c')) { return; } var b=document.getElementById(\"gt-nvframe\");if(b){b.style.position='unset';document.body.style.top='0px'}else{var child=document.createElement('iframe');child.id='gt-nvframe';child.src=document.location.href.replace('/translate_c','/translate_nv');child.style.width='100%';child.style.height='93px';document.body.insertBefore(child,document.body.firstChild);var t=document.querySelector('meta[name=\"viewport\"]');if(!t){var metaTag=document.createElement('meta');metaTag.name='viewport';metaTag.content='width=device-width, initial-scale=1.0';document.body.appendChild(metaTag)}}})();", null);
        }
        if ( (url.getSpec().startsWith("chrome://")
                        ||url.getSpec().startsWith("chrome-extension://")
                        ||url.getSpec().startsWith("mises://"))) {
            webContents.evaluateJavaScript("(function() { if (!document.location.href.includes('chrome://') && !document.location.href.includes('chrome-extension://') && !document.location.href.includes('mises://')) { return; } " + ADAPT_TO_MOBILE_VIEWPORT + "})();", null);
          
        }
        if ( ContextUtils.getAppSharedPreferences().getBoolean("accept_cookie_consent", true) && (url.getSpec().startsWith("http://") ||url.getSpec().startsWith("https://"))) {
            webContents.evaluateJavaScript("(function(){function clickItem(elem) { elem.click(); } function acceptViaAPIs(){typeof window.__cmpui=='function'&&window.__cmpui('setAndSaveAllConsent',!0);typeof window.Didomi=='object'&&window.Didomi.setUserAgreeToAll()}window.globalObserver=null;function setupObserver(){if(!window.globalObserver){var newelem=document.createElement('style');newelem.innerHTML='.qc-cmp-showing { visibility: hidden !important; } body.didomi-popup-open { overflow: auto !important; } #didomi-host { visibility: hidden !important; }';document.body.appendChild(newelem);var MutationObserver=window.MutationObserver||window.WebKitMutationObserver;window.globalObserver=new MutationObserver(check);window.globalObserver.observe(window.document.documentElement,{childList:true,subtree:true});window.setTimeout(function(){window.globalObserver && window.globalObserver.disconnect();window.globalObserver=null},15000)}check()}function check(){window.setTimeout(function(){var listeners=[];listeners.push({selector:'#qcCmpUi',fn:acceptViaAPIs});listeners.push({selector:'#didomi-popup',fn:acceptViaAPIs});listeners.push({selector: '.accept-cookies-button,#purch-gdpr-banner__accept-button,#bbccookies-continue-button,.user-action--accept,.consent-accept,.bcpConsentOKButton,.button.accept,#footer_tc_privacy_button,button[aria-label=\"Button to collapse the message\"],.gdpr-form>.btn[value=\"Continue\"],button[on^=\"tap:\"][on$=\".accept\"],button[on^=\"tap:\"][on$=\".dismiss\"],.js-cookies-button,.app-offer__close_js,.lg-cc__button_type_action',fn: clickItem});for(var i=0,len=listeners.length,listener,elements;i<len;i++){listener=listeners[i];elements=window.document.querySelectorAll(listener.selector);for(var j=0,jLen=elements.length,element;j<jLen;j++){element=elements[j];if(!element.ready){element.ready=true;listener.fn.call(element, element)}}}},5)}window.addEventListener('DOMContentLoaded',setupObserver);check()})();", null);
        }
        // tronlink 
        if (url.getSpec().startsWith("chrome-extension://ibnejdfjmmkpcnlpebklmnkoeoihofec")) {
          webContents.evaluateJavaScript(RenderStyleContent(TRONLINK_EXTENSION_STYLES), null);
        }
        // keplr 
        if (url.getSpec().startsWith("chrome-extension://dmkamcknogkgcdfhhbddcghachkejeap")) {
          webContents.evaluateJavaScript(RenderStyleContent(KEPLR_EXTENSION_STYLES), null);
        }
        // hulio 
        if (url.getSpec().startsWith("chrome-extension://olikokhekcibedhfkhbkmphgmopigibb")) {
          webContents.evaluateJavaScript(RenderStyleContent(HULIO_EXTENSION_STYLES), null);
        }
        // coinhub 
        if (url.getSpec().startsWith("chrome-extension://jgaaimajipbpdogpdglhaphldakikgef")) {
          webContents.evaluateJavaScript(RenderStyleContent(COINHUB_EXTENSION_STYLES), null);
        }
        // Avana 
        if (url.getSpec().startsWith("chrome-extension://ajnodjmfajgabkmeididajpkoobeiofn")) {
          webContents.evaluateJavaScript(RenderStyleContent(AVANA_EXTENSION_STYLES), null);
        }
        // Teleport Wallet 
        if (url.getSpec().startsWith("chrome-extension://gkeelndblnomfmjnophbhfhcjbcnemka")) {
          webContents.evaluateJavaScript(RenderStyleContent(TELEPORTWALLET_EXTENSION_STYLES), null);
        }
        // umi 
        if (url.getSpec().startsWith("chrome-extension://einhphiffjfjogeofkpclobkcgennocm")) {
          webContents.evaluateJavaScript(RenderStyleContent(UMI_EXTENSION_STYLES), null);
        }
        // TokenPocket 
        if (url.getSpec().startsWith("chrome-extension://mfgccjchihfkkindfppnaooecgfneiii")) {
          webContents.evaluateJavaScript(RenderStyleContent(TOKENPOCKET_EXTENSION_STYLES), null);
        }
        // ezdefi 
        if (url.getSpec().startsWith("chrome-extension://ejeemacpidnaejkhpbmfkadhgjhnolaa")) {
          webContents.evaluateJavaScript(RenderStyleContent(EZDEFI_EXTENSION_STYLES), null);
        }
        // lilico 
        if (url.getSpec().startsWith("chrome-extension://hpclkefagolihohboafpheddmmgdffjm")) {
          webContents.evaluateJavaScript(RenderStyleContent(LILICO_EXTENSION_STYLES), null);
        }
        // xdefi 
        if (url.getSpec().startsWith("chrome-extension://hmeobnfnfcmdkdcmlblgagmfpfboieaf")) {
          webContents.evaluateJavaScript(RenderStyleContent(XDEFI_EXTENSION_STYLES), null);
        }
        // soda 
        if (url.getSpec().startsWith("chrome-extension://ckeekocbghailhahfmkdgffiieolpagi")) {
          webContents.evaluateJavaScript(RenderStyleContent(SODA_EXTENSION_STYLES), null);
        }
        // traitsniper 
        if (url.getSpec().startsWith("chrome-extension://acaonckckmmakfgjfkgbfeepdhmajkeg")) {
          webContents.evaluateJavaScript(RenderStyleContent(TRAITSNIPER_EXTENSION_STYLES), null);
        }
        // similarweb 
        if (url.getSpec().startsWith("chrome-extension://hoklmmgfnpapgjgcpechhaamimifchmp")) {
          webContents.evaluateJavaScript(RenderStyleContent(SIMILARWEB_EXTENSION_STYLES), null);
        }
        // Talisman 
        if (url.getSpec().startsWith("chrome-extension://fijngjgcjhjmmpcmkeiomlglpeiijkld")) {
          webContents.evaluateJavaScript(RenderStyleContent(TALISMAN_EXTENSION_STYLES), null);
        }
        // celo extension wallet 
        if (url.getSpec().startsWith("chrome-extension://kkilomkmpmkbdnfelcpgckmpcaemjcdh")) {
          webContents.evaluateJavaScript(RenderStyleContent(CELOEXTENSION_EXTENSION_STYLES), null);
        }
        // Cosmos Wallet 
        if (url.getSpec().startsWith("chrome-extension://fcfcfllfndlomdhbehjjcoimbgofdncg")) {
          webContents.evaluateJavaScript(RenderStyleContent(COSMOS_EXTENSION_STYLES), null);
        }
        // Pontem Aptos Wallet
        if (url.getSpec().startsWith("chrome-extension://phkbamefinggmakgklpkljjmgibohnba")) {
          webContents.evaluateJavaScript(RenderStyleContent(PONTEM_EXTENSION_STYLES), null);
        }
        // Martian Aptos Wallet
        if (url.getSpec().startsWith("chrome-extension://efbglgofoippbgcjepnhiblaibcnclgk")) {
          webContents.evaluateJavaScript("(function() {window.addEventListener('DOMContentLoaded', function() { var t=document.querySelector('meta[name=\"viewport\"]');t&&(t.content=\"initial-scale=0.1\",t.content=\"width=device-width\") }); })();", null);
          webContents.evaluateJavaScript(RenderStyleContent(MARTIAN_EXTENSION_STYLES), null);
        }
        // StarMask
        if (url.getSpec().startsWith("chrome-extension://mfhbebgoclkghebffdldpobeajmbecfk")) {
          webContents.evaluateJavaScript(RenderStyleContent(STERMASK_EXTENSION_STYLES), null);
        }
        // Adena
        if (url.getSpec().startsWith("chrome-extension://oefglhbffgfkcpboeackfgdagmlnihnh")) {
          webContents.evaluateJavaScript(RenderStyleContent(ADENA_EXTENSION_STYLES), null);
        }
        // Push Protocol (Alpha)
        if (url.getSpec().startsWith("chrome-extension://lbdcbpaldalgiieffakjhiccoeebchmg")) {
          webContents.evaluateJavaScript(RenderStyleContent(PUSHPROTOCOL_EXTENSION_STYLES), null);
        }
        // coin 98
        if (url.getSpec().startsWith("chrome-extension://aeachknmefphepccionboohckonoeemg")) {
          webContents.evaluateJavaScript(RenderStyleContent(COIN98_EXTENSION_STYLES), null);
        }
        // DioWallet
        if (url.getSpec().startsWith("chrome-extension://ghdejoclpabnhidemhnfagafafcmgcfm")) {
          webContents.evaluateJavaScript(RenderStyleContent(DIOWALLET_EXTENSION_STYLES), null);
        }
        // Metamask
        if (url.getSpec().startsWith("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn")) {
          webContents.evaluateJavaScript(RenderStyleContent(METAMASK_EXTENSION_STYLES), null);
        }
        // nami
        if (url.getSpec().startsWith("chrome-extension://lpfcbjknijpeeillifnkikgncikgfhdo")) {
          webContents.evaluateJavaScript(RenderStyleContent(NAMI_EXTENSION_STYLES), null);
        }
        // bitski
        if (url.getSpec().startsWith("chrome-extension://feejiigddaafeojfddjjlmfkabimkell")) {
          webContents.evaluateJavaScript(RenderStyleContent(BITSKI_STYLES), null);
        }
        // ever wallet
        if (url.getSpec().startsWith("chrome-extension://cgeeodpfagjceefieflmdfphplkenlfk")) {
          webContents.evaluateJavaScript(RenderStyleContent(EVER_WALLET_STYLES), null);
        }
        // leap cosmos wallet
        if (url.getSpec().startsWith("chrome-extension://fcfcfllfndlomdhbehjjcoimbgofdncg")) {
          webContents.evaluateJavaScript(RenderStyleContent(LEAP_WALLET_STYLES), null);
        }
        // talisman-polkadot wallet
        if (url.getSpec().startsWith("chrome-extension://fijngjgcjhjmmpcmkeiomlglpeiijkld")) {
          webContents.evaluateJavaScript(RenderStyleContent(TALISMAN_WALLET_STYLES), null);
        }
        // talisman-polkadot wallet
        if (url.getSpec().startsWith("chrome-extension://ffnbelfdoeiohenkjibnmadjiehjhajb")) {
          webContents.evaluateJavaScript(RenderStyleContent(YOROI_WALLET_STYLES), null);
        }
        // dioxied wallet
        if (url.getSpec().startsWith("chrome-extension://ghdejoclpabnhidemhnfagafafcmgcfm")) {
          webContents.evaluateJavaScript(RenderStyleContent(DIOXIED_WALLET_STYLES), null);
        }
        // theta wallet
        if (url.getSpec().startsWith("chrome-extension://ckelpdlfgochnkdgikcgbimdcfgpkhgk")) {
          webContents.evaluateJavaScript(RenderStyleContent(THETE_WALLET_STYLES), null);
        }
        // fetch wallet
        if (url.getSpec().startsWith("chrome-extension://ellkdbaphhldpeajbepobaecooaoafpg")) {
          webContents.evaluateJavaScript(RenderStyleContent(FETCG_EXTENSION_STYLES), null);
        }
    }

    private static String RenderStyleContent(String STYLES) {
      return "(function(){window.addEventListener('load', function() { console.log('hack style'); var styleTag = document.createElement('style'); styleTag.type='text/css'; styleTag.innerHTML = "+ STYLES +";document.body.appendChild(styleTag)})})()";
    }
    
    private static boolean IsSearchUrl(String sUrl) {
        if (sUrl == null || sUrl.isEmpty()) {
          return false;
        }

        try {
          URL url = new URL(sUrl);
          String sHost = url.getHost();
          if (sHost.contains(".google."))
              return true;
        } catch(MalformedURLException e) {
        }

        return false;
    }

   // tronlink 
   private static final String TRONLINK_EXTENSION_STYLES = "'#root, body, html {width:100vw} body, html {overflow:auto;} .accountsPage .accountInfo,.pageContainer {width:100vw}'";

   // keplr 
   private static final String KEPLR_EXTENSION_STYLES = "'html,body,#app {width:100vw} .container-3Ms4OvCWNwJapzrn-T5Uyd {margin-left:0;width:90vw} .container-3Ms4OvCWNwJapzrn-T5Uyd.large {margin-left:0;width:100vw} .background-xbpI23q2_pUFQsakAulEU {width:100vw}'";
   // keplr 
   private static final String FETCG_EXTENSION_STYLES = "'html,body,#app {width:100vw} .container-3Ms4OvCWNwJapzrn-T5Uyd {margin-left:0;width:90vw} .container-3Ms4OvCWNwJapzrn-T5Uyd.large {margin-left:0;width:100vw} .background-xbpI23q2_pUFQsakAulEU {width:100vw}'";

   // hulio 
   private static final String HULIO_EXTENSION_STYLES = "'#interaction {padding:unset}'";

   // coinhub 
   private static final String COINHUB_EXTENSION_STYLES = "'.select-action__select-buttons {flex-direction:column;}.select-action__select-button {width:100vw;margin-left:0;}'";

   // avana 
   private static final String AVANA_EXTENSION_STYLES = "'.css-v7pilp {max-width: 100vw} .css-1xvtca5 {max-width: 100vw;min-width: 100vw} .css-10otl7m{    max-width: 29.5vw;}'";

   // Teleport Wallet 
   private static final String TELEPORTWALLET_EXTENSION_STYLES = "'.expanded-view .popup-size, body {width: 100vw;height:inherit}'";

   // umi 
   private static final String UMI_EXTENSION_STYLES = "'.select-action__selection {flex-direction:column} .select-action .form:first-child {margin-right:0;margin-bottom:10px} .select-action .select-action__selection .form,body .form{min-width:95vw!important;max-width:95vw!important;} .select-action__body {padding:20px;box-sizing:border-box} .initialize__body{width:95vw;min-width:95vw} .end-of-flow .steps__img{position:inherit!important;left:0!important}'";

   // TokenPocket
   private static final String TOKENPOCKET_EXTENSION_STYLES = "'.select-action__select-buttons {flex-direction:column} .select-action__select-button {margin-left:0;margin-bottom:10px} .first-time-flow{padding:20px} .select-action__select-button:first-child{margin-right: 0} .first-time-flow__import-container{width: 100%} .first-time-flow__import-select {flex-direction: column} .first-time-flow__import-select--seed-type{margin-top:10px} .first-time-flow__import-password-container {flex-direction: column} .first-time-flow__import-word-item{margin-right: 10px} .first-time-flow__import-word-input .MuiInputBase-root{width: 100px} .first-time-flow__import-word-item:nth-of-type(3n){margin-right: 10px} .first-time-flow__import-vault-error{width:100%} .end-of-flow__container,.end-of-flow{width: 100%} .extension-guide__container{display: none} .import-account__content{width: 100%} .first-view-main-wrapper{width: 90vw} .import-account__input-container,.first-time-flow__password{flex-direction: column} .first-time-flow__container{width:100%}  .welcome-page__container{width:100%} .welcome-page__wrapper{height: 100vh;width: 100vw;margin: -20px;padding: 20px;}'";

   // ezdefi 
   private static final String EZDEFI_EXTENSION_STYLES = "'#root {height:auto!important} .privacy-policy-page .confirmModal .content-area {height:calc(100vh - 245px);} .container {width:100vw}'";

   // lilico 
   private static final String LILICO_EXTENSION_STYLES = "'body .h-full{width:100vw!important;height:100vh!important}body .css-8exq99 {display: block;padding-left: 20px;padding-right:20px} body .css-ukvzfb {width: 100vw;height: auto} body .css-ff30gh {padding: 24px 24px 32px} body .css-168mpgf,body .css-11ickte,body .css-qbxbh8,body .css-r0k0t6{width:95vw;height:auto;} body .css-18xmly0 {width: 100%} body .css-rgv6dd {width:95vw;height:auto;} body .css-105skla{width:95vw;height:auto;} body .css-1uez6az{width:auto;} body .css-1qjqn4b{width:95vw;height:auto;}body .css-qxmw80{font-size:0.8rem} .css-1aiq4ho,.css-19gyshh{width: 100vw} .css-tlszgr{width: 100%}'";

   // xdefi 
   private static final String XDEFI_EXTENSION_STYLES = "'.gsrcgK,.index-module__wrapper___W2wCS .index-module__buttonWrapper___TqFk5  {flex-direction: column;align-items: center;} .index-module__onboarding___XQLfD .index-module__contentContainer___Iujo0 .index-module__body___grFff {width: 100vw;min-width:100vw;padding: 0 20px} .jeVaVP{min-width:100%} .izXqrv{width:90vw} .eCVsxE,.bmgqC {flex-direction: column} .hOUSGf,.khrviK{max-width: 100vw;} .bmgqC{align-items: center;} .iXKWaq{max-width: 50vw;} body{height: 100% !important} body .ghZMib,body .jbBTqN{flex-direction: column; align-items:center}'";

   // soda
   private static final String SODA_EXTENSION_STYLES = "'.options-container .navbar .logo {margin:11px 43px} .options-container .navbar {width:100vw;height:auto} .options-container .navbar>ul .link-item{width:auto;height:auto;padding:7px 12px;white-space:nowrap} .options-container .navbar>ul{overflow:auto;display:flex}'";
   
   // Traitsniper 
   private static final String TRAITSNIPER_EXTENSION_STYLES = "'.asset-line .grid a {white-space: nowrap;width: 60%;overflow: hiddentext-overflow: ellipsis;} .css-jwylpl{width: 100vw}'";
   
   // similarweb 
   private static final String SIMILARWEB_EXTENSION_STYLES = "'iframe#similarweb-outer-content {width: 98vw !important;transform: translateX(calc(-98vw - 1%)) !important}'";
   
   // Talisman 
   private static final String TALISMAN_EXTENSION_STYLES = "'.fLhJqK > section > div .welcome-text, .fLhJqK > section > div .welcome-buttons {width: 87vw; !important} .csupaF > section{padding: 0} .bCtBOW > section > .hflex > .content {width: 90vw;margin-bottom: 100px;} .dmEafL {width:auto;padding:2.8rem} .jvPIFO .main-area{padding: 20px} .bwSBFR .main-area{padding:20px} .jfBDUi{grid-template-columns: initial}'";

   // celo extension wallet 
   private static final String CELOEXTENSION_EXTENSION_STYLES = "'.select-action__select-buttons {flex-direction:column;}.select-action__select-button {width:100vw;margin-left:0;}'";

   // cosmos wallet 
   private static final String COSMOS_EXTENSION_STYLES = "'.flex.z-10.overflow-scroll.mt-24.items-start.justify-center .flex.flex-row{flex-direction: column;} .flex.z-10.overflow-scroll.mt-24.items-start.justify-center .flex.flex-col.justify-center{width:100%} .flex.flex-row.justify-center.items-center.h-12.rounded-3xl.border-none {width: 100%} .flex.z-10.overflow-scroll.mt-24.items-start.justify-center .shrink.flex-col.rounded-lg.border-gray-800 {margin-top:20px;width:100%} .rounded-2xl.dark:bg-gray-900.bg-white-100.text-xs.font-medium.box-border.font-Satoshi.p-6 {width:100%} .overflow-y-auto.bg-gray-50.dark:bg-black-100{width:100%} .w-[408px]{width:100%}'";

   // Pontem Aptos Wallet
   private static final String PONTEM_EXTENSION_STYLES = "'.Welcome_component__yTuSP .Welcome_expandImage__CUQsJ {display: none !important} .Welcome_mobileImage__5pIgx{display: block !important}'";
  
   // Martian Aptos Wallet
   private static final String MARTIAN_EXTENSION_STYLES = "'.sc-beqWaB.fdTxvX {font-size: 36px} .MuiGrid-item.css-1o6ow4v,.MuiGrid-item.css-krw8lj{max-width: 100%} .main_main_cont{max-width: 100%} header+div{width: 93vw} .MuiGrid-item.css-mimkti{padding: 0} .MuiInputBase-colorPrimary.css-1nn34ff{width: 80vw} .MuiGrid-item.css-1pxj66c,.MuiGrid-item.css-fhsby0,.MuiGrid-item.css-12ffmac{width: 100%} .sc-ktEKTO.zidSu{flex: 300px 0 0;margin-right: 20px;}.MuiGrid-root.MuiGrid-item.css-1wxaqej+div{overflow-x: auto;overflow-y: hidden;box-sizing: border-box;width: 100%;}.sc-dmqHEX.cmYkMv{width: 100%;max-width: 100%;}.MuiGrid-container.css-p5uq5n,.MuiGrid-root.css-9hz2xg{width: 100%}.MuiGrid-item.css-1se9gly{width: 40%}.MuiGrid-item.css-6nu8rw{width: 90%}'";

   // StarMask 
   private static final String STERMASK_EXTENSION_STYLES = "'.select-action__select-buttons {flex-direction:column} .select-action__select-button {margin-left:0;margin-bottom:10px} .first-time-flow{padding:20px}'";

   // adena 
   private static final String ADENA_EXTENSION_STYLES = "'html, body{width:100vw}'";

   // push protocol 
   private static final String PUSHPROTOCOL_EXTENSION_STYLES = "'.hdHyne{width:100vw;height:auto;overflow:auto} .transition-effect{display: none}'";


   // dio wallet 
   private static final String DIOWALLET_EXTENSION_STYLES = "'.app{max-width: 100vw;} .create-account,.layout-with-header-content{width: 100%}'";
   // coin 98
   private static final String COIN98_EXTENSION_STYLES = "'.popup-chain-selection{height: 93vh}'";

  // metamask extension wallet 
   private static final String METAMASK_EXTENSION_STYLES = "'.select-action__select-buttons {display:flex; flex-direction:column;}.select-action__select-button {width:100vw;margin-left:0;}html,body{width:100% !important;height:100% !important}'";

  // nami extension wallet 
   private static final String NAMI_EXTENSION_STYLES = "'.css-189koq5 {overflow: auto; padding: 0} .css-162046j{max-width: 100vw} #internalPopup .css-u0vho7{min-height: calc(100vh - 50px)}'";

  // bitski extension wallet 
   private static final String BITSKI_STYLES = "'.h-screen {height: 94vh!important}'";
  
  // ever extension wallet 
    private static final String EVER_WALLET_STYLES = "'.slide--landing .slide__content{max-width: 100%;}'";
  
  // leap extension wallet 
    private static final String LEAP_WALLET_STYLES = "'.mt-16.items-start.justify-center .flex.flex-row{flex-direction: column}'";

  // talisman extension wallet 
    private static final String TALISMAN_WALLET_STYLES = "'.inline-grid.grid-cols-2.gap-12{grid-template-columns: auto} .transition-colors.text-body.flex.flex-col.justify-between.rounded{width: 100%} .ktDzRo{max-width: 100%} .itkJEU > section > .hflex > .content{width: 100vw} img.absolute.left-12{width: 50px; top: 88px} .bxBcOW{top: 2.4rem}'";
  // yoroi extension wallet 
    private static final String YOROI_WALLET_STYLES = "'.TermsOfUseText_terms.TermsOfUseText_fixedHeight{max-height: calc(100vh - 484px)} .TermsOfUseForm_component .TermsOfUseForm_checkbox{flex-direction: column;align-items: start} .MainCards_heroCardsList{overflow-x: auto;} .YoroiModern .WalletAdd_component .WalletAdd_heroCardsItemLink, .YoroiRevamp .WalletAdd_component .WalletAdd_heroCardsItemLink{max-width: 100%;} .css-u2ag5c{min-width: 90vw}'";
  // dioxied extension wallet 
    private static final String DIOXIED_WALLET_STYLES = "'.layout-with-header-content{overflow-y: auto}'";

  // thete extension wallet 
    private static final String THETE_WALLET_STYLES = "'.OptionsPage__option-cards{flex-direction: column; gap: 10px;} #root, body{overflow-y: auto;}'";
    private static final String MAKE_USER_AGENT_WRITABLE = ""
+"(function() {"
+"    function createProperty(value) {"
+"        var _value = value;"
+""
+"        function _get() {"
+"            return _value"
+"        }"
+""
+"        function _set(v) {"
+"            _value = v"
+"        }"
+"        return {"
+"            'get': _get,"
+"            'set': _set"
+"        }"
+"    };"
+""
+"    function makePropertyWritable(objBase, objScopeName, propName, initValue) {"
+"        var newProp, initObj;"
+"        if (objBase && objScopeName in objBase && propName in objBase[objScopeName]) {"
+"            if (typeof initValue === 'undefined') {"
+"                initValue = objBase[objScopeName][propName]"
+"            }"
+"            newProp = createProperty(initValue);"
+"            try {"
+"                Object.defineProperty(objBase[objScopeName], propName, newProp)"
+"            } catch (e) {"
+"                initObj = {};"
+"                initObj[propName] = newProp;"
+"                try {"
+"                    objBase[objScopeName] = Object.create(objBase[objScopeName], initObj)"
+"                } catch (e) {}"
+"            }"
+"        }"
+"    };"
+"    makePropertyWritable(window, 'navigator', 'userAgent');"
+"})();";

    private static final String ADAPT_TO_MOBILE_VIEWPORT = ""
+"(function() {"
+"window.addEventListener('DOMContentLoaded', function() {"
+"    var t = document.querySelector('meta[name=\"viewport\"]');"
+"    t && (t.content = 'initial-scale=1', t.content = 'width=device-width');"
+"    if (!t) {"
+"        var metaTag = document.createElement('meta');"
+"        metaTag.name = 'viewport';"
+"        metaTag.content = 'width=device-width, initial-scale=1.0';"
+"        document.body.appendChild(metaTag);"
+"    }"
+"});"
+"})();";

    private static final String MESSENGER_SCRIPT = ""
+"(function() {"
+"window.addEventListener('load', function() {"
+"if (!document.location.href.includes('https://m.facebook.com/messenger/install') && !document.location.href.includes('https://m.facebook.com/messages')) { return; } "
+"var gotomessenger = document.createElement('div');"
+"gotomessenger.innerHTML = \"<a href='https://www.messenger.com' target='_blank' style='margin: 2rem; display: inline-block;'><b>Go to www.messenger.com instead</a>\";"
+"gotomessenger.id = '_kb_gotomessenger';"
+"var e1 = document.querySelector('._8rws') || document.querySelector('._2bu8');"
+"if (!document.getElementById('_kb_gotomessenger'))"
+"e1.parentNode.insertBefore(gotomessenger, e1.nextSibling);"
+"});"
+"})();";

    private static final String MESSENGER_VIEWPORT_SCRIPT = ""
+"(function() {"
+"if (!document.location.href.includes('messenger.com/')) { return; } "
+"var sheet = document.createElement('style');"
+"sheet.innerHTML = '.jgljxmt5 { min-height: calc(93vh - var(--header-height)); } .g0mhvs5p.g0mhvs5p { width: 150px; }';"
+"document.body.appendChild(sheet);"
+"})();";

    private static final String AMP_SCRIPT = ""
+"(function() {"
+"function _cleanupAmp()"
+"{"
+"  document.querySelectorAll('a[data-amp-cur]').forEach(function(a) {"
+"    a.href = a.getAttribute('data-amp-cur');"
+"    console.log('Detected AMP item: (link: ' + a.href + ')');"
+"    if (!a.href || a.href.includes('/search')) { a.href = a.getAttribute('data-amp'); console.log('Corrected AMP item: (link: ' + a.href + ')'); }"
+"    if (a.href.indexOf('?') == -1) { a.href = a.href + '?'; }"
+"    a.removeAttribute('data-amp');"
+"    a.removeAttribute('data-amp-cur');"
+"    a.removeAttribute('ping');"
+"  });"
+""
+"  document.querySelectorAll('span[aria-label=\"AMP logo\"]').forEach(function(a) {"
+"     a.style.display='none';"
+"  });"
+"  if (document.getElementsByClassName('amp-cantxt').length >= 1 && document.location.href.match(/\\/amp[\\/|\\.]/)) { document.location.replace(document.getElementsByClassName('amp-cantxt')[0].innerText); }"
+"  if (document.location.href.match(/\\/amp[\\/|\\.]/) && document.querySelector('head > link[rel=\"canonical\"]') != null && document.querySelector('head > link[rel=\"canonical\"]').href != document.location.href) { document.location.replace(document.querySelector('head > link[rel=\"canonical\"]').href); };"
+"}"
+""
+"document.addEventListener('DOMNodeInserted', _cleanupAmp);"
+"_cleanupAmp();"
+"})();";

    private static final String EDGE_SCRIPT = ""
+"(function() {"
+"    if (!document.location.href.includes('https://microsoftedge.microsoft.com/addons')) {"
+"        return;"
+"    }"
+ MAKE_USER_AGENT_WRITABLE
+"    window.navigator.userAgent=window.navigator.userAgent + ' Edg/' + window.navigator.appVersion.match(/Chrome\\/(\\d+(:?\\.\\d+)+)/)[1];"
+"    var _kb_setIntervalCnt = 0;"
+"    var _kb_setInterval = window.setInterval(function() {"
+"        var xpath = function(xpathToExecute) {"
+"            var result = [];"
+"            var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);"
+"            for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {"
+"                result.push(nodesSnapshot.snapshotItem(i));"
+"            }"
+"            return result;"
+"        };"
+"        xpath(\"//button[contains(@id,'getOrRemoveButton')]\").forEach(function(individualButton) {"
+"            individualButton.setAttribute('style', 'opacity: 1; background: rgb(0, 120, 212) !important; height: 60px; cursor: pointer !important;');"
+"            individualButton.removeAttribute('disabled');"
+"            individualButton.innerHTML = \"<a href=https://edge.microsoft.com/extensionwebstorebase/v1/crx?response=redirect&acceptformat=crx3&x=id%3D\" + individualButton.id.split('-')[1] + \"%26installsource%3Dondemand%26uc target='_blank' style='color: white; text-decoration: none'><b>Get CRX</b><br>(Hold and tap<br>Download Link)</a>\";"
+"        });"
+"        if (_kb_setIntervalCnt++ >= 10) { window.clearInterval(_kb_setInterval); }"
+"    }, 1000);"
+"})();";

  
}
