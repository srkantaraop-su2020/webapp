echo "Inside before install"
cd /home/ubuntu
pwd
echo "Currently in home/ubuntu"
ls -al
sudo rm -rf app frontend test *.sh *.html *.yml *.json *.js *.txt .env
ls -al
echo "Finished deleting files"