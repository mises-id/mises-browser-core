find . -type l | while read -r link
do
    target=$(readlink "$link")
    if [ -e "$target" ]
    then
        rm "$link" && cp "$target" "$link" || echo "ERROR: Unable to change $link to $target"
    else
        # remove the ": # " from the following line to enable the error message
        : # echo "ERROR: Broken symlink"
    fi
done