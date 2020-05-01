import React from 'react';
import axios from 'axios';

const CLIENT_ID = "761264053583-j89sivin580neuh16fp1tnvrcngpvj5a.apps.googleusercontent.com";
const Secret_key = "ixrtn0Gx1L_Ntd4rQp6nQWdE";

class GoogleClassComponent extends React.Component{

    constructor(props) {
        super(props);
        this.sendRequest = this.sendRequest.bind(this);


    }

    authGoogleClassRoom = () => {

        window.gapi.auth.authorize({

                client_id: CLIENT_ID, scope: ['https://www.googleapis.com/auth/classroom.courses.readonly'],
                immediate: false, approval_prompt: "force", response_type: "code", access_type: "offline" },
            (authResult) => {
                if (authResult && !authResult.error) {
                    console.log("authResult",authResult)
                    this.sendRequest(authResult.code);
                } else {
                    //  authorization_fail();
                }
            });
    };

    sendRequest = (code) => {

        const restRequest = window.gapi.client.request({

            'path': "https://www.googleapis.com/oauth2/v4/token",
            'method': 'POST',
            'params': {
                'code': code,
                'client_id': CLIENT_ID,
                'client_secret': Secret_key,
                'redirect_uri': 'postmessage',
                'grant_type': 'authorization_code',
            },
            'headers': {
                'Content-type': 'application/x-www-form-urlencoded'
            },

        });
        restRequest.execute( (jsonResponse, rawResponse) => {
            let google_token = jsonResponse.access_token;
            window.gapi.auth.setToken({
                access_token: google_token
            });
            let  refresh_token = jsonResponse.refresh_token;
            this.googleCoursesLists(refresh_token);

        });



        //


    };

    googleCoursesLists = (refresh_token) => {


       let  params = {
            access_token: refresh_token,

        };

        console.log(params);
        axios.post('https://google-class-room.herokuapp.com/api/v1/auth/courses', params)
            .then(response => {
                console.log("Course listing", response);
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        return (
            <div>

                <button onClick={this.authGoogleClassRoom}>Login with Google</button>
            </div>
        );
    }
}

export  default GoogleClassComponent;