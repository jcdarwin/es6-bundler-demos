import React from 'react';

// Using ES6 syntax
// https://babeljs.io/blog/2015/06/07/react-on-es6-plus
export default class Hello extends React.Component {
    render() {
        return (
            <h1>Hello {this.props.text}</h1>
        )
    }
}
