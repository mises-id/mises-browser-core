#include "src/chrome/browser/shortcuts/create_shortcut_for_current_web_contents_task.cc"
#include "base/task/task_traits.h"
#include "base/task/thread_pool.h"

#if BUILDFLAG(IS_ANDROID)
namespace shortcuts {

void CreateShortcutOnUserDesktop(ShortcutMetadata shortcut_metadata,
                                 ShortcutCreatorCallback complete) {
  base::SequencedTaskRunner::GetCurrentDefault()->PostTask(
      FROM_HERE,
      base::BindOnce(std::move(complete), /*created_shortcut_path=*/base::FilePath(),
                            ShortcutCreatorResult::kError));
}

scoped_refptr<base::SequencedTaskRunner> GetShortcutsTaskRunner() {
  return base::ThreadPool::CreateSequencedTaskRunner(
      {base::MayBlock(), base::TaskPriority::USER_VISIBLE,
       base::TaskShutdownBehavior::BLOCK_SHUTDOWN});
}

}
#endif