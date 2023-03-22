#include "src/chrome/browser/ui/bookmarks/bookmark_utils_desktop.cc"

namespace chrome {
namespace {

#if BUILDFLAG(IS_ANDROID)
// Returns in |urls|, the url and title pairs for each open tab in browser.
void GetURLsAndFoldersForOpenTabs(
    Browser* browser,
    std::vector<BookmarkEditor::EditDetails::BookmarkData>* folder_data) {
  std::vector<std::pair<GURL, std::u16string>> tab_entries;
  base::flat_map<int, TabGroupData> groups_by_index;
  for (int i = 0; i < browser->tab_strip_model()->count(); ++i) {
    std::pair<GURL, std::u16string> entry;
    auto* contents = browser->tab_strip_model()->GetWebContentsAt(i);
    GetURLAndTitleToBookmark(contents, &(entry.first), &(entry.second));
    tab_entries.push_back(entry);
    auto tab_group_id = browser->tab_strip_model()->GetTabGroupForTab(i);
    std::u16string title;
    if (tab_group_id.has_value()) {
      title = browser->tab_strip_model()
                  ->group_model()
                  ->GetTabGroup(tab_group_id.value())
                  ->visual_data()
                  ->title();
    }
    groups_by_index.emplace(i, std::make_pair(tab_group_id, title));
  }
  GetURLsAndFoldersForTabEntries(folder_data, tab_entries, groups_by_index);
}
#endif


}  // namespace

#if BUILDFLAG(IS_ANDROID)
void OpenAllIfAllowed(
    Browser* browser,
    base::OnceCallback<content::PageNavigator*()> get_navigator,
    const std::vector<const bookmarks::BookmarkNode*>& nodes,
    WindowOpenDisposition initial_disposition,
    bool add_to_group) {
    std::vector<UrlAndId> url_and_ids = GetURLsToOpen(
      nodes, browser->profile(),
      initial_disposition == WindowOpenDisposition::OFF_THE_RECORD);

  auto do_open = [](Browser* browser,
                    base::OnceCallback<content::PageNavigator*()> get_navigator,
                    std::vector<UrlAndId> url_and_ids_to_open,
                    WindowOpenDisposition initial_disposition,
                    absl::optional<std::u16string> folder_title,
                    chrome::MessageBoxResult result) {
    if (result != chrome::MESSAGE_BOX_RESULT_YES)
      return;
    if (!get_navigator)
      return;
    content::PageNavigator* navigator = std::move(get_navigator).Run();
    if (!navigator)
      return;
    const auto opened_web_contents =
        OpenAllHelper(navigator, std::move(url_and_ids_to_open), initial_disposition);
    if (folder_title.has_value()) {
      TabStripModel* model = browser->tab_strip_model();

      // Figure out which tabs we actually opened in this browser that aren't
      // already in groups.
      std::vector<int> tab_indices;
      for (int i = 0; i < model->count(); ++i) {
        if (base::Contains(opened_web_contents, model->GetWebContentsAt(i)) &&
            !model->GetTabGroupForTab(i).has_value()) {
          tab_indices.push_back(i);
        }
      }

      if (tab_indices.empty())
        return;

      absl::optional<tab_groups::TabGroupId> new_group_id =
          model->AddToNewGroup(tab_indices);
      if (!new_group_id.has_value())
        return;

      // Use the bookmark folder's title as the group's title.
      TabGroup* group = model->group_model()->GetTabGroup(new_group_id.value());
      const tab_groups::TabGroupVisualData* current_visual_data =
          group->visual_data();
      tab_groups::TabGroupVisualData new_visual_data(
          folder_title.value(), current_visual_data->color(),
          current_visual_data->is_collapsed());
      group->SetVisualData(new_visual_data);

      model->OpenTabGroupEditor(new_group_id.value());
    }
  };

  // Skip the prompt if there are few bookmarks.
  size_t child_count = url_and_ids.size();
  if (child_count < kNumBookmarkUrlsBeforePrompting) {
    do_open(
        browser, std::move(get_navigator), std::move(url_and_ids), initial_disposition,
        add_to_group
            ? absl::optional<std::u16string>(nodes[0]->GetTitledUrlNodeTitle())
            : absl::nullopt,
        chrome::MESSAGE_BOX_RESULT_YES);
    return;
  }

  // The callback passed contains the pointer |browser|. This is safe
  // since if |browser| is closed, the message box will be destroyed
  // before the user can answer "Yes".

  ShowQuestionMessageBox(
      browser->window()->GetNativeWindow(),
      l10n_util::GetStringUTF16(IDS_PRODUCT_NAME),
      l10n_util::GetStringFUTF16(IDS_BOOKMARK_BAR_SHOULD_OPEN_ALL,
                                 base::NumberToString16(child_count)),
      base::BindOnce(do_open, browser, std::move(get_navigator),
                     std::move(urls), initial_disposition,
                     add_to_group ? absl::optional<std::u16string>(
                                        nodes[0]->GetTitledUrlNodeTitle())
                                  : absl::nullopt));
}

void OpenAllNow(content::PageNavigator* navigator,
                const std::vector<const BookmarkNode*>& nodes,
                WindowOpenDisposition initial_disposition,
                content::BrowserContext* browser_context) {
  // Opens all |nodes| of type URL and any children of |nodes| that are of type
  // URL. |navigator| is the PageNavigator used to open URLs. After the first
  // url is opened |navigator| is set to the PageNavigator of the last active
  // tab. This is done to handle a window disposition of new window, in which
  // case we want subsequent tabs to open in that window.

  std::vector<UrlAndId> urls = GetURLsToOpen(
      nodes, browser_context,
      initial_disposition == WindowOpenDisposition::OFF_THE_RECORD);

  OpenAllHelper(navigator, std::move(urls), initial_disposition);
}


int OpenCount(gfx::NativeWindow parent,
              const std::vector<const bookmarks::BookmarkNode*>& nodes,
              content::BrowserContext* incognito_context) {
  return GetURLsToOpen(nodes, incognito_context, incognito_context != nullptr)
      .size();
}

int OpenCount(gfx::NativeWindow parent,
              const BookmarkNode* node,
              content::BrowserContext* incognito_context) {
  std::vector<const BookmarkNode*> nodes;
  nodes.push_back(node);
  return OpenCount(parent, std::vector<const bookmarks::BookmarkNode*>{node},
                   incognito_context);
}

bool ConfirmDeleteBookmarkNode(gfx::NativeWindow window,
                               const BookmarkNode* node) {
  DCHECK(node && node->is_folder() && !node->children().empty());
  return ShowQuestionMessageBoxSync(
             window, l10n_util::GetStringUTF16(IDS_PRODUCT_NAME),
             l10n_util::GetPluralStringFUTF16(
                 IDS_BOOKMARK_EDITOR_CONFIRM_DELETE,
                 ChildURLCountTotal(node))) == MESSAGE_BOX_RESULT_YES;
}

void ShowBookmarkAllTabsDialog(Browser* browser) {
  Profile* profile = browser->profile();
  BookmarkModel* model = BookmarkModelFactory::GetForBrowserContext(profile);
  DCHECK(model && model->loaded());

  const BookmarkNode* parent = GetParentForNewNodes(model);
  BookmarkEditor::EditDetails details =
      BookmarkEditor::EditDetails::AddFolder(parent, parent->children().size());

  GetURLsAndFoldersForOpenTabs(browser, &(details.bookmark_data.children));
  DCHECK(!details.bookmark_data.children.empty());
  BookmarkEditor::Show(browser->window()->GetNativeWindow(), profile, details,
                       BookmarkEditor::SHOW_TREE,
                       base::BindOnce(
                           [](const Profile* profile) {
                             // We record the profile that invoked this option.
                             RecordBookmarksAdded(profile);
                           },
                           base::Unretained(profile)));
}

bool HasBookmarkURLs(const std::vector<const BookmarkNode*>& selection) {
  return !GetURLsToOpen(selection).empty();
}

bool HasBookmarkURLsAllowedInIncognitoMode(
    const std::vector<const BookmarkNode*>& selection,
    content::BrowserContext* browser_context) {
  return !GetURLsToOpen(selection, browser_context, true).empty();
}

void GetURLsAndFoldersForTabEntries(
    std::vector<BookmarkEditor::EditDetails::BookmarkData>* folder_data,
    std::vector<std::pair<GURL, std::u16string>> tab_entries,
    base::flat_map<int, TabGroupData> groups_by_index) {
  absl::optional<tab_groups::TabGroupId> current_group_id;
  for (size_t i = 0; i < tab_entries.size(); ++i) {
    std::pair<GURL, std::u16string> entry = tab_entries.at(i);
    if (entry.first.is_empty()) {
      continue;
    }
    BookmarkEditor::EditDetails::BookmarkData child;
    child.url = entry.first;
    child.title = entry.second;
    if (groups_by_index.at(i).first.has_value()) {
      if (current_group_id != groups_by_index.at(i).first.value()) {
        BookmarkEditor::EditDetails::BookmarkData tab_group;
        tab_group.title = groups_by_index.at(i).second;
        folder_data->push_back(tab_group);
        current_group_id = groups_by_index.at(i).first;
      }
      folder_data->back().children.push_back(child);
    } else {
      folder_data->push_back(child);
    }
  }
}
#endif  // BUILDFLAG(IS_ANDROID)

}  // namespace chrome
