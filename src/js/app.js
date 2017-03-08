import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class Main extends React.Component {
    constructor(){
        super();

        this.state = {
            //todo: add later
        };
    }
    render(){
        return (
            <div className="container">
                <h1>Hello World</h1>
            </div>
        );
    }
}


ReactDOM.render(<Main />, $('#root').get(0));