#!/bin/sh

FILES=`ls *.xtb`
for FILE in ${FILES}
{
    mv ${FILE} ${FILE/brave/mises}
}
