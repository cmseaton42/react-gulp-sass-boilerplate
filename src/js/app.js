import React from 'react';
import ReactDOM from 'react-dom';

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
                <h1>Hello!!</h1>
            </div>
        );
    }
}


ReactDOM.render(<Main />, document.getElementById('root'));