cd /home/ubuntu
value=`cat ip.txt`
echo "$value"
echo "Installing pm2 for the server........."
sudo npm install pm2 -g -f
echo "Finished Installing pm2 for the server"
echo "Starting node server now......."
sudo sed -i -e "s|ipAddress|$value|g" server.js
IP_ADDRESS=$IP_ADDRESS pm2 start server.js
echo "Node server is up and running, find the active servers below"
pm2 list
cd frontend/
echo "Installing pm2 for the client........."
sudo npm install pm2 --save
echo "Finished Installing pm2 for the client"
echo "Starting react server now......."
cd /home/ubuntu/frontend/src/APIs/
sudo sed -i -e "s|ipAddress|$value|g" api.js
cd /home/ubuntu/frontend/src/components/sell/
sudo sed -i -e "s|ipAddress|$value|g" createBook.jsx
sudo sed -i -e "s|ipAddress|$value|g" updateBook.jsx
cd /home/ubuntu/frontend/
REACT_APP_IP_ADDRESS=`$IP_ADDRESS` pm2 start node_modules/react-scripts/scripts/start.js --name "frontend"
echo "Node server is up and running, find the active servers below"
pm2 list
echo "Starting cloud watch agent now..."
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ubuntu/cloudwatch-config.json -s
echo "Setting up pm2 restart service now"
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
sudo mkdir -p /etc/systemd/system/pm2-ubuntu.service.d
sudo touch /etc/systemd/system/pm2-ubuntu.service.d/10_auto_restart_pm2.conf
sudo echo "[Service]" >> /etc/systemd/system/pm2-ubuntu.service.d/10_auto_restart_pm2.conf
sudo echo "Restart=always" >> /etc/systemd/system/pm2-ubuntu.service.d/10_auto_restart_pm2.conf
sudo echo "RestartSec=3" >> /etc/systemd/system/pm2-ubuntu.service.d/10_auto_restart_pm2.conf
sudo systemctl daemon-reload
pm2 save 
sudo systemctl status pm2-ubuntu
echo "Finised setting up pm2 restart service"