import 'regenerator-runtime/runtime';
import icon from '../images/icon-location.svg';
import {gsap} from "gsap";
(() => {
    //State for marker
	let marker;
	//Class selectors as objects
	const DOMStrings = {
		inputEl:".middle__input",
		btnSubmit:".btn-submit",
		ip:"#ip",
		location:"#location",
		timezone:"#timezone",
		isp:"#isp",
		error:".error",
		closeErr:".error__close",
		errorMsg:".error__msg",
		introHeading:".intro__heading",
		jsCoder:".js--coder",
		slider:".slider",
		intro:".intro",
		fadeIn:".js--fadein-animation",
		results:".middle__results"
	};
	//Animation settings
    const gsapAnimation =() => {
    	let tl = gsap.timeline({defaults:{duration:1,ease:"power.in"}});
	   	tl.to(DOMStrings.introHeading,{translateY:0,stagger:.5,opacity:1,ease:"power.in"});
	   	tl.from(DOMStrings.jsCoder,{scale:.8,ease:"bounce"});
	   	tl.to(DOMStrings.slider,{delay:1.2,translateY:"-100%"});
	   	tl.to(DOMStrings.intro,{translateY:"-100%"},"-=.8");
	   	tl.from(DOMStrings.fadeIn,{delay:1,stagger:.5,opacity:0});
	   	tl.from(DOMStrings.results,{scale:.8});
    };
    //Creates a custom location icon
	const locationIcon = L.icon({
		iconUrl:`${icon}`,
		iconSize:[25,30],
		iconAnchor:[12.5,35],
		popupAnchor:[1,1]
	});
	//MAP SECTION HERE
	const map =(() => {
		let mymap = L.map("map").setView([0,0],3);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
			foo: 'bar', 
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			zoomOffset:0
		}).addTo(mymap);
		//Returns mymap instance
		return {
			mymap
		};
	})();
	const selectElement = (el,value) => {
		document.querySelector(el).textContent = value;
	};
	//Set marker in the map
	const makeMarker = (lat,lng) => {
		if(marker != undefined) {
			map.mymap.removeLayer(marker);
		}
	    marker = L.marker([lat,lng],{icon:locationIcon}).addTo(map.mymap);
		map.mymap.flyTo([lat,lng],13);
	};
	//Updates UI dynamically as per the search or query
	const updateUI = (ip,country,timezone,isp,city) => {
		selectElement(DOMStrings.ip,ip);
		selectElement(DOMStrings.timezone,`UTC ${timezone}`);
		selectElement(DOMStrings.location,`${city},${country}`);
		selectElement(DOMStrings.isp,isp);
	};
	//Displays Error Message if any
	const displayErrMsg = (message) => {
		document.querySelector(DOMStrings.errorMsg).innerHTML = message;
        document.querySelector(DOMStrings.error).style.transform = "translate(-50%,-50%)";
	};
	//Clears the error message
	const closeErrMsg = (event) => {
		event.preventDefault();
		document.querySelector(DOMStrings.error).style.transform = "translate(-50%,-500%)";
	};
	//Checks if the entered query is an IP address or a domain for e.g 192.168.10.1
	//or facebook.com
	const isIP = (value) => {
		return /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/.test(value);
	};

   //Main App Section Here
	const app = (() => {
		const clearInputField = () => {
			document.querySelector(DOMStrings.inputEl).value ="";
		};
        //Async function to fetch datas from the geoipify API
		async function fetchDatas(query){
			try {
				if(query !== "" && /^\s+$/.test(query) === false){
					let data,type;
					if(isIP(query) || query === "default"){
						type="ipAddress";
					} else {
						type = "domain";
					}
					if(query === "default"){
						data = await fetch(`https://geo.ipify.org/api/v1?apiKey=at_f7jldEqAyFylucjcKnexmivMYRkEH&${type}=`);
					} else {
						data = await fetch(`https://geo.ipify.org/api/v1?apiKey=at_f7jldEqAyFylucjcKnexmivMYRkEH&${type}=${query}
					`);
					}
					let result = await data.json();
					query = result.ip;
					if(result.ip === query) {
					  makeMarker(result.location.lat,result.location.lng);
					  updateUI(result.ip,result.location.country,result.location.timezone,
					  	result.isp,result.location.city);
					} else {
						displayErrMsg(`Input valid <strong>IPv4</strong> or <strong>IPv6</strong> address or <strong>domain</strong>`);
					}
				} else {
					throw "Input valid <strong>IPv4</strong> or <strong>IPv6</strong> address or <strong>domain</strong>";
				}
			} catch(error){
				displayErrMsg("Input valid <strong>IPv4</strong> or <strong>IPv6</strong> address or <strong>domain</strong> ");
			}
		}
		//Callback after the query is entered
		const search = (event) => {
			if(event.keyCode === 13){
				fetchDatas(event.target.value);
				clearInputField();
			} else if(event.type === "click"){
				let value = event.target.closest(".middle__search").children[0].value;
				fetchDatas(value);
				clearInputField();
			}
		};
		//EventListeners
		document.querySelector(DOMStrings.inputEl).addEventListener("keyup",search);
		document.querySelector(DOMStrings.btnSubmit).addEventListener("click",search);
		document.querySelector(DOMStrings.closeErr).addEventListener("click",closeErrMsg);
		return {
			fetchDatas
		};
	})();
	//Initialization section here
	const init = () => {
		gsapAnimation();
		app.fetchDatas("default");
	};
	init();
 })();