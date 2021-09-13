import React from 'react'
import {
    Switch,
    Route,
    BrowserRouter as Browser
} from "react-router-dom";
import PaperList from './PaperList'
import Packs from './Packs'


export default function Router() {
    return (
        <div>
            <Browser>
                <Switch>
                    <Route exact path="/">
                        <PaperList />
                    </Route>
                    <Route  path="/packs">
                        <Packs />
                    </Route>
                </Switch>
            </Browser>
        </div>
    )
}
