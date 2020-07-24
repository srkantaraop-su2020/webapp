const aws = require('aws-sdk');
var sns = new aws.SNS({});
const logger = require('../config/winston-logger.config');

exports.snsSendPasswordResetEmail = function(request, response) {
           
    logger.info("Sending the link to email :: " + request.body.userName);
            
    let payload = {
        data: {
            Email: request.body.userName
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
            response.status(500)
            response.json({"msg":"something went wrong"})
        } else {
            response.status(200)
            response.json({
                data
            })
            logger.info('Email for ::' + request.body.userName + " sent successfully!");
        }
    })
};