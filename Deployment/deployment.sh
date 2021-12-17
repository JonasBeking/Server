#!/bin/bash

echo "Deploying newest Master Version"
cd ..
git pull
cd Server
pm2 restart index.js
