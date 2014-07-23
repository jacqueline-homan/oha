#!/bin/sh
## THIS is bragging.
FILES=wp-includes/js/
for f in $FILES
do
      echo "Processing $f file..."
            echo -e "\n\n// $f\n" >> pluggins.js
            cat ${f} >> pluggins.js
        done
