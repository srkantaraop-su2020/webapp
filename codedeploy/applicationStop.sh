echo "Inside application stop"
cd /home/ubuntu
pwd
echo "Currently in home/ubuntu"
ls -al
sudo rm -rf app frontend test *.sh *.html *.yml *.json *.js *.txt .env
ls -al
pm2 stop server
pm2 stop frontend
sudo rm -f /var/lib/dpkg/lock-frontend
sudo rm -f /var/lib/dpkg/lock
echo "Finished deleting files"