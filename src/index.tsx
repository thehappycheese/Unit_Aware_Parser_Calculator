import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import NicksTwoColumnLayout from './Components/NicksTwoColumnLayout';

ReactDOM.render(
	<React.StrictMode>
		<NicksTwoColumnLayout paddingPx={10}>
			<div id="Index-LeftBar">
				<h1 style={{ color: "white", textAlign: "center" }}>
					Nick's Knuth-Bendix
				</h1>
				<div className="Index-Panel" >
					<nav>
						<ul>
							<li>Merge</li>
							<li>To GeoJSON</li>
							<li>To GeoJSON s</li>
						</ul>
					</nav>
					Hey
				</div>
			</div>
			<div id="Index-AppSpace">
				<App />
			</div>
		</NicksTwoColumnLayout>
	</React.StrictMode>,
	document.getElementById('root')
);

