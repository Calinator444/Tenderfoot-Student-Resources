import {React, useEffect} from 'react';
import {doStuff} from './SharedFunctions';
import Mainnav from './Mainnav';




	function Home() {

		useEffect(()=>{
			var num = doStuff;
			console.log(num);
			}, [])
		return(
		<div>
		<Mainnav/>
		<h1>This is a home page</h1>
		</div>
		);
	}


export default Home;