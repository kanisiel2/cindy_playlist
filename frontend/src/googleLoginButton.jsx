import {GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import axios from 'axios';

const GoogleLoginButton = () => {
    const clientId = '160066034036-ia0kc1s3gim3u3a9k7bsoih1p0ujc8ap.apps.googleusercontent.com'
    return (
        <>
            <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin width="150"
                onSuccess={credentialResponse => {
                    console.log(jwtDecode(credentialResponse.credential||""));
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
            </GoogleOAuthProvider>
        </>
    );
};

export default GoogleLoginButton