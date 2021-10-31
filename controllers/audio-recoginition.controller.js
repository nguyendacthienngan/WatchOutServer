const url = require('url');
const fs = require('fs');
const crypto = require('crypto');
const request = require('request');

const defaultOptions = {
  host: process.env.ACRCLOUD_HOST,
  endpoint: '/v1/identify',
  signature_version: '1',
  data_type:'audio',
  secure: true,
  access_key: process.env.ACRCLOUD_ACCESS_KEY,
  access_secret: process.env.ACRCLOUD_SECRET_KEY
};

function buildStringToSign(method, uri, accessKey, dataType, signatureVersion, timestamp) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
}

function sign(signString, accessSecret) {
  return crypto.createHmac('sha1', accessSecret)
    .update(Buffer.from(signString, 'utf-8'))
    .digest().toString('base64');
}

/**
 * Identifies a sample of bytes
 */
function identify(data, options, cb) {

  const current_data = new Date();
  const timestamp = current_data.getTime()/1000;

  const stringToSign = buildStringToSign('POST',
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp);

  const signature = sign(stringToSign, options.access_secret);

  const formData = {
    sample: data,
    access_key:options.access_key,
    data_type:options.data_type,
    signature_version:options.signature_version,
    signature:signature,
    sample_bytes:data.length,
    timestamp:timestamp,
  }
  request.post({
    url: "http://"+options.host + options.endpoint,
    method: 'POST',
    formData: formData
  }, cb);
}


// var bitmap = fs.readFileSync('into1.mp3');

function audioRecognition (data) {
    identify(Buffer.from(data), defaultOptions, function (err, httpResponse, body) {
      if (err) console.log(err);
      console.log(body);
    });
}

exports.audioRecognition = audioRecognition