import { bucket } from './Config';
import * as AWS from 'aws-sdk';
import { ListObjectsOutput } from 'aws-sdk/clients/s3';

var albumBucketName = bucket;
var bucketRegion = 'ap-southeast-1';
var IdentityPoolId = 'ap-southeast-1:d1e44f27-050b-4d53-b38d-8ce553977bef';

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

const s3 = new AWS.S3({
  apiVersion: '2012-10-17',
  params: {Bucket: albumBucketName}
});

export function getObjectsFromS3(): Promise<ListObjectsOutput> {
  return new Promise((resolve, reject) => {
    s3.listObjects({Bucket: albumBucketName}, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

export function uploadObject(key: string, obj: string | Blob) {
  console.log(albumBucketName);
  return new Promise((resolve, reject) => {
    s3.upload({Bucket: albumBucketName, Key: key, Body: obj}, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

export function getPreSignedUrl(key: string): Promise<string> {
  const params = {
    Bucket: albumBucketName, 
    Key: key
   };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        reject(err);
      }
      resolve(url);
    });
  });
}