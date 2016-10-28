var config = require('../config');

// console.log("config: ", config);

import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory, DefaultRoute, IndexLink } from 'react-router'
import Fetch from 'react-fetch'

class App extends Component {
	render () {
		return (
			<Router history={hashHistory}>
				<Route path='/' component={Container}>
					<IndexRoute component={Home} />
					<Route path='/zip=:id' component={Show} />
					<Route path='*' component={NotFound} />
				</Route>
			</Router>
		)
	}
}

class MyForm extends Component {
	constructor(props) {
		super(props);    
		this.state = {value: ''};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		this.setState({value: e.target.value});
	}

	isInvalidZipCode(zip) {
		return !(/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip));
	}
	
	renderError(zip) {
		var element = document.getElementById('error-msg');
		var zip = zip.length > 1 ? zip : "(blank)";

		element.innerHTML = zip + " is not a valid zip code!";
	}

	handleSubmit(e) {
		e.preventDefault();

		if (this.isInvalidZipCode(this.state.value)) {
			this.renderError(this.state.value);
			return;
		}

		hashHistory.push('/zip=' + this.state.value);
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<input
						type="text"
						value={this.state.value}
						onChange={this.handleChange}
						placeholder="Enter zip code" />
					<input 
						type="submit" 
						value="Submit" />
				</form>
				<p id="error-msg"></p>
			</div>
		)
  	}
}

class WeatherService extends Component{
	constructor(props) {
		super(props);
		this.zip = this.props.zip;
		this.url = `http://api.openweathermap.org/data/2.5/weather?zip=${this.zip},us&appid=${config.weatherAppId}&units=imperial`;
		this.onSuccess = this.onSuccess.bind(this);
		this.onError = this.onError.bind(this);
	}

	onSuccess() {
		console.log("onSuccess is running");
	}

	onError() {
		console.log("onError is running");
	}

	render(){
		console.log("WeatherService render is running");
	    return (
			<Fetch 
				url={this.url}
				onSuccess={this.onSuccess}
				onError={this.onError}>
				<Weather
					zip={this.zip} />
			</Fetch>
		)
	}
}

class Weather extends Component {

  render() {
	// if (this.props.weather) {
		console.log("this.props: ", this.props);
	// 	this.props.weather = this.props.weather[0];
	// 	console.log("this.props: ", this.props);
	// }
  	// var testObj = this.props;
  	// console.log("testObj: ", testObj);
	    	// <p>Rain fall (last 3 hours): {this.props.rain && this.props.rain.3h}</p>
    return (
    	<div>
	    	<IndexLink activeClassName='active' to='/'>Search again</IndexLink>&nbsp;
	    	<h3>Current weather conditions for {this.props.zip} ({this.props.name})</h3>
	    	<p>Data collected at: {new Date(this.props.dt*1000).toTimeString()}</p>
	    	{ this.props.weather && <div>Main: {this.props.weather[0].main}</div> }
	    	<p>Main: {this.props.weather && this.props.weather[0].main}</p>
	    	<p>Description: {this.props.weather && this.props.weather[0].description}</p>
	    	<p>Cloud Coverage: {this.props.clouds && this.props.clouds.all}%</p>
	    	<p>Current temp: {this.props.main && this.props.main.temp}</p>
	    	<p>Humidity: {this.props.main && this.props.main.humidity}%</p>
	    	<p>Wind Speed: {this.props.wind && this.props.wind.speed}</p>
	    	<p>Wind Direction: {this.props.wind && this.props.wind.direction} MPH</p>
	    	<p>Sunrise: {this.props.sys && new Date(this.props.sys.sunrise*1000).toTimeString()}</p>
	    	<p>Sunset: {this.props.sys && new Date(this.props.sys.sunset*1000).toTimeString()}</p>

	    </div>
    )
  }
}

const Home = () => (
	<div>
		<h1>Weather!</h1>
		<MyForm></MyForm>
	</div>
)

const NotFound = () => (
	<h1>404... This page was not found, you dingus!</h1>
)

const Container = (props) => (
	<div>
		{props.children}
	</div>
)

const Show = (props) => (
  <div>
    <WeatherService 
    	zip={props.params.id} />
  </div>
)

export default App