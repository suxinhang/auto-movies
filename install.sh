#!/bin/bash

rm -rf dist
rm -rf dist.tar.gz
yarn build
tar -zcvf dist.tar.gz  dist

#scp dist.tar.gz root@8.141.151.70:/mnt/dq/dq
scp -P43197 dist.tar.gz root@104.233.170.71:/mnt/home_made/dldist
