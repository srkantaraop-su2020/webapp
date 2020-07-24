const aws = require('aws-sdk');
var sns = new aws.SNS({});
const logger = require('../config/winston-logger.config');

exports.snsSendPasswordResetEmail = function(request, response) {
           
    logger.info("Sending the following link :: " + link
            + " to email :: " + request.body.userName);
            
    let payload = {
        data: {
            Email: request.body.userName,
            link: "randomlink"
        }
    };

    payload.data = JSON.stringify(payload.data);
    payload = JSON.stringify(payload);

    let params = {
        Message: payload,
        TopicArn: process.env.TOPIC_ARN
    }

    sns.publish(params, (err, data) => {
        if (err) {
            logger.error("Email for ::" + request.body.userName + " was not successful error ::" + err);
            return data;
        } else {
            logger.info('Email for ::' + request.body.userName + " sent successfully!");
        }
    })
};