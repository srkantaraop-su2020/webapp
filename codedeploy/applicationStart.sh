cd /home/ubuntu
echo "Displaying contents of ip2.txt..........."
cat ip2.sh
echo "Finished displaying contents of ip2.txt"
set -a 
sudo source .env 
set +a
echo "Set IP ADDRESS as env"
echo $IP_ADDRESS
echo "Finished verifying set env"
pwd
echo "Installing pm2 for the server........."
sudo npm install pm2 -g -f
echo "Finished Installing pm2 for the server"
echo "Starting node server now......."
IP_ADDRESS=$IP_ADDRESS pm2 start server.js
echo "Node server is up and running, find the active servers below"
pm2 list
cd frontend/
echo "Installing pm2 for the client........."
sudo npm install pm2 --save
echo "Finished Installing pm2 for the client"
echo "Starting react server now......."
REACT_APP_IP_ADDRESS=$IP_ADDRESS pm2 start node_modules/react-scripts/scripts/start.js --name "frontend"
echo "Node server is up and running, find the active servers below"
pm2 list