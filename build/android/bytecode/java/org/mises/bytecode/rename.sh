#!/bin/sh

FILES=`ls *.java`
for FILE in ${FILES}
{
    mv ${FILE} ${FILE/Brave/Mises}
}
