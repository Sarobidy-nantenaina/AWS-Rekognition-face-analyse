import AWS from 'aws-sdk';
function Connexion() {

    // Configure the credentials provider to use your identity pool
    AWS.config.region = "eu-west-2";
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "eu-west-2:371cdf1c-657e-4e3f-a6a0-3cdcf905bfdc"
    });
}
export default Connexion;
