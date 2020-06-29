echo "Inside application stop"
cd /home/ubuntu
pwd
echo "Currently in home/ubuntu"
ls -al
sudo rm -rf app frontend test *.sh *.html *.yml *.json *.js *.txt .env
ls -al
pm2 stop server
echo "Finished deleting files"