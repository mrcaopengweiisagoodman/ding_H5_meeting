import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-keeper'


import Auditapprove from 'pages/auditapprove/';
import Addauditapprove from 'pages/auditapprove_add/';
import Detailauditapprove from 'pages/auditapprove_detail/';
import Auditcontract from 'pages/auditcontract/';
import Result from 'pages/result/';
import Addmeeting from 'pages/meeting_add/';
import ExportWord from 'pages/export_word/';
import ExportExcel from 'pages/export_excel/';
import Statistical from 'pages/statistical/';


const rootRoute =
    <HashRouter>
		<div>
			<Auditapprove.route />
			<Addauditapprove.route />
			<Detailauditapprove.route />
			<Auditcontract.route />
			<Result.route />
			<Addmeeting.route />
			<ExportWord.route />
			<ExportExcel.route />
			<Statistical.route />
		</div>
    </HashRouter>;

ReactDOM.render( rootRoute, document.getElementById('App') );
