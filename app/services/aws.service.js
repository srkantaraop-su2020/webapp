const aws = require('aws-sdk');
aws.config.update({
    region: 'us-east-1', // Put your aws region here
    signatureVersion:"v4" 
})
const logger = require('../config/winston-logger.config');

exports.snsSendPasswordResetEmail = function(request, response) {
        
    var sns = new aws.SNS({
        region: 'us-east-1', // Put your aws region here
        signatureVersion:"v4"
    });

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