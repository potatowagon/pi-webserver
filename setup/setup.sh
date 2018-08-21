#!/bin/bash

#update pi
sudo apt-get update

#upgrade pi
sudo apt-get upgrade

#install motion
sudo apt-get install motion 

#set motion configs
sudo yes | cp -rf ./motion.conf /etc/motion/motion.conf
sudo yes | cp -rf ./motion /etc/default/motion 

# install node js
sudo wget -O - https://raw.githubusercontent.com/audstanley/NodeJs-Raspberry-Pi/master/Install-Node.sh | bash;
exit;
node -v;

# install bcm lib
wget "http://www.airspayce.com/mikem/bcm2835/bcm2835-1.56.tar.gz"
tar zxvf ./bcm2835-1.56.tar.gz
cd bcm2835-1.56
./configure
make
sudo make check
sudo make install

# install node js dependencies
sudo npm install --unsafe-perm
