cd /etc/profile.d

env

FILE=userdata.sh
while ! test -f "$FILE"; do
    sleep 30s
    echo "$FILE not exist"
done

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ubuntu/cloudwatch-config.json -s