#!/usr/bin/python

import sys
import os
import glob
import subprocess
import argparse

src_root = 'src/'
class Applier():
    
    def __init__(self):
        self.files = []
        self.dryrun = True
        self.dryrun_counter = 0

    def start(self, dryrun):
        self.dryrun = dryrun
        #res = glob.glob("patches/err/*.patch", recursive=True)
        res = glob.glob("patches/err/grd_patches/*.patch", recursive=True)

        for path in res:
            self.files.append(path)
        self.handle_file(self.files)

    def cmd_run(self, cmds, cwd):
        PIPE = subprocess.PIPE
        process = subprocess.Popen(cmds, cwd=cwd, stdout=PIPE, stderr=PIPE)
        return process.communicate()
      
    def get_target_path(self, patch):

        return src_root + patch.replace('patches/err/grd_patches/', '').replace('patches/err/', '').replace('.patch', '').replace('-', "/")

    def copy_run(self, source, dest):
        if os.path.exists(dest):
            print(dest, "trying")
            print("replace-from" , source)
        else:
            print("copy-from" , source)
            patch_dir = os.path.dirname(dest)
            os.makedirs( patch_dir, exist_ok = True)
            stdoutput, stderroutput = self.cmd_run(['cp', source,  dest], patch_dir)
            if len(stderroutput) > 0:
                exit()

    def dry_run(self, patch):
        self.dryrun_counter += 1
        print('dry_run: #', self.dryrun_counter,  patch)
        file = self.get_target_path(patch)
        if os.path.exists(file):
            print(file, "trying")
            stdoutput, stderroutput = self.cmd_run(['patch', '--dry-run', '--reject-file=/dev/stdout',file, patch], '.')
            output = stdoutput.decode('utf-8')
            erroutput = stderroutput.decode('utf-8')
            print(output)
            print(erroutput)
            if self.has_error(output + erroutput):
                # with open(patch, 'r') as f:
                #     print(f.read())
                print(patch, "has_error")
                exit()
        else:
            print(patch, "not-appliable")

    def has_error(self, output):
      return 'FAILED' in output or 'ignoring' in output or 'failed' in output or 'malformed' in output or 'unexpected' in output

    def run(self, patch):
        print('run:', patch)
        file = self.get_target_path(patch)
        if os.path.exists(file):
            print(file, "trying")
            stdoutput, stderroutput = self.cmd_run(['patch', '--reject-file=/dev/stdout',file, patch], '.')
            output = stdoutput.decode('utf-8')
            erroutput = stderroutput.decode('utf-8')
            print(output)
            print(erroutput)
            if self.has_error(output + erroutput):
                with open(patch, 'r') as f:
                    print(f.read())
                exit()
            self.cmd_run(['mv', patch,  patch.replace('patches/err/', 'patches/fixed/')], '.')
        else:
            print(patch, "not-appliable")

    def dry_run_resource(self, patch):
        patch_rel = patch
        file = patch_rel.replace('.patch', '')
        if os.path.exists(legacy_root + file):
            if os.path.exists(src_root + file):
                print(patch, "trying")
                print("replace-from" , legacy_root + file)
            else:
                print("copy-from" , legacy_root + file)
        else:
            print(patch, "not-appliable")

    def run_resource(self, patch):
        patch_rel = patch.replace(patch_root, '')
        file = patch_rel.replace('.patch', '')
        if os.path.exists(legacy_root + file):
            self.copy_run(legacy_root + file, src_root + file)
        else:
            print(patch, "not-appliable")

    def handle_res_file(self, files):
        for file in files:
            if self.dryrun:
                self.dry_run_resource(file)
            else:
                self.run_resource(file)

    def handle_file(self, files):
        for file in files:
            if self.dryrun:
                self.dry_run(file)
            else:
                self.run(file)
    def print_file(self, files):
        file_names = []
        for file in files:
            file_names.append(os.path.basename(file).split('/')[-1])
        file_names.sort()
        for file in file_names:
            print(file)


def main():
    argument_parser = argparse.ArgumentParser()
    argument_parser.add_argument('--apply', action='store_true')
    args = argument_parser.parse_args()
    applier = Applier()
    if args.apply:
        applier.start(False)
    else:
        applier.start(True)

if __name__ == '__main__':
    main()