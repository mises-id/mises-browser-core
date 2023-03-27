
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_finder.h"
#include "chrome/browser/ui/scoped_tabbed_browser_displayer.h"

#include "src/chrome/browser/download/download_commands.cc"


#if BUILDFLAG(IS_ANDROID)

Browser* DownloadCommands::GetBrowser() const {
  if (!model_)
    return nullptr;

  chrome::ScopedTabbedBrowserDisplayer browser_displayer(model_->profile());
  DCHECK(browser_displayer.browser());
  return browser_displayer.browser();
}

bool DownloadCommands::IsDownloadPdf() const {
  if (!model_)
    return false;

  base::FilePath path = model_->GetTargetFilePath();
  return path.MatchesExtension(FILE_PATH_LITERAL(".pdf"));
}

bool DownloadCommands::CanOpenPdfInSystemViewer() const {
#if BUILDFLAG(IS_WIN)
  bool is_adobe_pdf_reader_up_to_date = false;
  if (IsDownloadPdf() && IsAdobeReaderDefaultPDFViewer()) {
    is_adobe_pdf_reader_up_to_date =
        DownloadTargetDeterminer::IsAdobeReaderUpToDate();
  }
  return IsDownloadPdf() &&
         (IsAdobeReaderDefaultPDFViewer() ? is_adobe_pdf_reader_up_to_date
                                          : true);
#else  // BUILDFLAG(IS_WIN)
  return IsDownloadPdf();
#endif
}

#endif 