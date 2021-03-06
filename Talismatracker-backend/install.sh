#!/bin/bash

mkdir backup

npm install

node setup_db.js

export SERVERPATH=$(pwd)
sed "s=SERVERPLACEHOLDER=$SERVERPATH=g" talismat.tmp > talismat
#sed "s=SERVERPLACEHOLDER=$SERVERPATH=g" backup.tmp > backup.sh

cp talismat /etc/init.d/talismat
chmod 777 /etc/init.d/talismat

service talismat start
