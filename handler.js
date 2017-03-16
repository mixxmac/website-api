'use strict';
const AWS = require('aws-sdk');
const async = require('async');
const ses = new AWS.SES();

module.exports.registerRequest = function(event, context, callback){
  async.waterfall([
    (next) => {
      console.log(event);
      console.log(JSON.stringify(`Event: event`));
        const data = JSON.parse(event.body);

        ses.sendEmail({
        Destination: {
            ToAddresses: [process.env.NOTIFICATION_EMAIL]
        },
        Message: {
            Body: {
                Text: {
                    Data: data.message
                }
            },
            Subject: {
                Data: 'Request from: ' + data.firstName + " "
                  + data.lastName + "(" + data.email + ")"
            }
        },
        Source: process.env.NOTIFICATION_EMAIL
        }, next);
    }], (err, results) => {

        var message = "Request was successfully registered";
        var responseCode = 200;

        if (err) {
            console.log('ERROR', err);
            message = "Failed to submit a request";
            responseCode = 400;
        }

        const response = {
            statusCode: responseCode,
            headers: {
                "Access-Control-Allow-Origin" : process.env.ALLOWED_ORIGIN,
                "Access-Control-Allow-Credentials" : true
            },
            body: JSON.stringify({ "message": message })
        };

        callback(null, response);
    });
};
