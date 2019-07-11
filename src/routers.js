import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-keeper'


import Auditapprove from 'pages/auditapprove/';
import Addauditapprove from 'pages/auditapprove_add/';
import Detailauditapprove from 'pages/auditapprove_detail/';
import Auditcontract from 'pages/auditcontract/';
import Result from 'pages/result/';


const rootRoute =
    <HashRouter>
		<div>
			<Auditapprove.route />
			<Addauditapprove.route />
			<Detailauditapprove.route />
			<Auditcontract.route />
			<Result.route />
		</div>
    </HashRouter>;

ReactDOM.render( rootRoute, document.getElementById('App') );
