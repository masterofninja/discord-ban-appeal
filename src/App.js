import React, {useState} from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Box from "@material-ui/core/Box";
import Home from "./Components/Home";
import Callback from "./Components/Callback";
import Form from "./Components/Form";
import {Redirect} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Success from "./Components/Success";
import Error from "./Components/Error";
import PageNotFoundError from "./Components/404";
import Helmet from "react-helmet";
const axios = require("axios")

const DiscordOauth2 = require("discord-oauth2");


function App() {
    const [icon, setIcon] = useState("https://media.discordapp.net/attachments/856299804018999296/858937121930346546/download_1.jpeg");
    const [title, setTitle] = useState("StoneClan");

    axios.get("/.netlify/functions/guild")
        .then((response) => {
            if (response.status === 200) {
                setIcon(`https://cdn.discordapp.com/icons/${process.env.REACT_APP_GUILD_ID}/${response.data.guild_icon}.png`)
                setTitle(response.data.guild_name)
            } else {
                alert("Unable to fetch server from API. Please check all your environment variables.")
            }
        })

    return (
        <Router className="App">
            <Helmet>
                <meta charSet="utf-8"/>
                <title>{`${title} Discord Ban Appeal Application`}</title>
                <link rel="icon" href={icon} type="image/x-icon"/>
            </Helmet>
            <Grid container
                  spacing={4}
                  direction="column"
                  justify="center"
                  alignItems="center"
            >
                <Grid item xs={12}>
                    <Box style={{backgroundImage: `url(${process.env.REACT_APP_BANNER_URL})`}}
                         className={"banner"}>
                        <img alt={title + " Discord Icon"} src={icon} className={"icon"} height={150}/>
                        <h1>{title} Discord Ban Appeal System</h1>
                    </Box>
                </Grid>
                <Switch>
                    <Route path="/" exact>
                        <Home/>
                    </Route>
                    <Route path="/callback" exact>
                        <Callback/>
                    </Route>
                    <Route path="/404" render={(props) => <Error {...props}/>}/>

                    <PrivateRoute path="/form" exact>
                        <Form/>
                    </PrivateRoute>
                    <PrivateRoute path="/success" exact>
                        <Success/>
                    </PrivateRoute>
                    <Route path="*" component={PageNotFoundError}/>

                </Switch>
            </Grid>

        </Router>
    );
}

function PrivateRoute({children, ...rest}) {
    return (
        <Route
            {...rest}
            render={({location}) =>
                localStorage.getItem("access_token") ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    );
}

export default App;

export const oauth = new DiscordOauth2({
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    redirectUri: window.location.origin + "/callback",
});
