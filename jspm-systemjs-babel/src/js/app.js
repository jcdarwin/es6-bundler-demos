import 'systemjs-hot-reloader/default-listener.js';

export function __reload(m) {
  if (m.component.state)
    component.setState(m.component.state);
}

import React from 'react';
import ReactDOM from 'react-dom';
import {Hello} from 'jspm-react-component';

export let component = ReactDOM.render(
	<Hello text="World" />,
	document.getElementById("container")
);
