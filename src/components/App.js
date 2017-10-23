import React from 'react'
import apps from './apps.json'

class Portfolio extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedApp: apps.professional[0], showLoadingScreen: true, showMessage: false, externalLink: "" };
        this.updateSelectedApp = this.updateSelectedApp.bind(this);
        this.updateMessageState = this.updateMessageState.bind(this);
        this.handleMessageVisibility = this.handleMessageVisibility.bind(this);
        this.animateApps = this.animateApps.bind(this);
    }

    toggleLoadingScreen() {
        this.setState({showLoadingScreen: !this.state.showLoadingScreen});
    }

    animateApps() {
        const apps = document.querySelectorAll(".app");
        const appLabels = document.querySelectorAll(".category-title");
        let delay = 1.75;
        apps.forEach(function(app) {
            app.style.animationDelay = `${delay}s`;
            delay = delay + .1;
        });
        appLabels.forEach(function(label) {
            label.style.animationDelay = `${delay}s`;
            delay = delay + .1;
        });
    }
    
    componentDidMount() {
        setTimeout(() => {
            this.setState({showLoadingScreen: false});
        }, 1000);
        this.animateApps();
    }

    updateSelectedApp(selectedApp) {
        this.setState({selectedApp});
    }

    updateMessageState(destination) {
        this.setState({showMessage: !this.state.showMessage, externalLink: destination});
    }

    handleMessageVisibility() {
        this.setState({showMessage: !this.state.showMessage});
    }

    render() {
        const selectedApp = this.state.selectedApp;
        const showLoadingScreen = this.state.showLoadingScreen;
        const showMessage = this.state.showMessage;
        const destination = this.state.externalLink;
        const professionalApps = apps.professional.map((app) =>
            <ExpandedApp app={app} handleMessageVisibility={this.handleMessageVisibility} updateMessageState={this.updateMessageState}/>
        );
        const personalApps = apps.personal.map((app) =>
            <ExpandedApp app={app} handleMessageVisibility={this.handleMessageVisibility} updateMessageState={this.updateMessageState}/>
        );
        return (
            <div className="portfolio-container">
                <LoadingScreen showLoadingScreen={this.state.showLoadingScreen}/>
                <PopupMessage destination={destination} handleMessageVisibility={this.handleMessageVisibility} showMessage={showMessage}/>
                <div id="portfolio" className={`portfolio${this.state.showLoadingScreen ? "" : " active"}`}>
                    <div className="expanded-app-container" style={{ transform: `translate3d(${selectedApp.xPos}, 0, 0)` }}>
                        {professionalApps}
                        {personalApps}
                    </div>
                    {/* <ExpandedApp selectedApp={this.state.selectedApp} handleMessageVisibility={this.handleMessageVisibility} updateMessageState={this.updateMessageState}/> */}
                    <AppList selectedApp={this.state.selectedApp} updateSelectedApp={this.updateSelectedApp} updateMessageState={this.updateMessageState} showMessage={showMessage}/>
                    <div className="background-image-blurred" style={{backgroundImage: `url(${selectedApp.background})`}}></div>
                </div>
            </div>
        )
    }
}

class ExpandedAppTitle extends React.Component {
    render() {
        const selectedApp = this.props.selectedApp;
        return (
            <img className="expanded-app-logo" src={selectedApp.altLogo} />
        )
    }
}

class LoadingScreen extends React.Component {
    render() {
        return (
            <div className={`loading-screen${this.props.showLoadingScreen ? " active" : ""}`}>
                <img className="loading-screen-logo" src="assets/logos/logo.png"/>
            </div>
        )
    }
}

class ExpandedApp extends React.Component {
    constructor(props) {
        super(props);
        this.handleMessageVisibility = this.handleMessageVisibility.bind(this);
    }

    handleMessageVisibility(destination) {
        this.props.updateMessageState(destination);
    }

    render() {
        const selectedApp = this.props.app;
        const destination = selectedApp.destination;
        const technology = selectedApp.technology.map((technology) =>
            <span key={technology}>{technology}</span>
        );
        return (
            <div className={`expanded-app ${selectedApp.id}`}>
                <img className="expanded-app-logo" src={selectedApp.altLogo}/>
                <div className="expanded-app-content">
                    <div className="side-bar">
                        <span className="label">Position</span>
                        <span>{selectedApp.position}</span>
                        <span className="label">Technology</span>
                        {technology}
                    </div>
                    <div className="app-info">
                        <div className="location-and-duration">
                            <span className="label">Location</span>
                            <span>{selectedApp.location}</span>
                            <span className="label">Duration</span>
                            <span>{selectedApp.duration}</span>
                        </div>
                        <p>{selectedApp.description}</p>
                        <div className="button" onClick={() => this.handleMessageVisibility(destination)}>
                            {<img src="assets/logos/arrow.svg"/>}
                        </div>
                    </div>
                </div>
                <div className="background-image" style={{backgroundImage: `url(${selectedApp.background})`}}></div>
            </div>
        )
    }
}

class AppList extends React.Component {
    render() {
        const professionalApps = apps.professional.map((app) =>
            <App key={app.id} app={app} selectedApp={this.props.selectedApp} updateSelectedApp={this.props.updateSelectedApp} showMessage={this.props.showMessage}/>
        );
        const personalApps = apps.personal.map((app) =>
            <App key={app.id} app={app} selectedApp={this.props.selectedApp} updateSelectedApp={this.props.updateSelectedApp} showMessage={this.props.showMessage}/>
        );
        const socialApps = apps.social.map((app) =>
            <ExternalApp key={app.id} app={app} updateMessageState={this.props.updateMessageState} showMessage={this.props.showMessage}/>
        );
        const selectedApp = this.props.selectedApp;
        return (
            <div className="app-list-container">
                <div className="app-list-row">
                    <div className="app-list-section">
                        <div className="category-title">Big Budget</div>
                        <div className="app-list">
                            {professionalApps}
                        </div>
                    </div>
                    <div className="app-list-section">
                        <div className="category-title">Indie</div>
                        <div className="app-list">
                            {personalApps}
                        </div>
                    </div>
                </div>
                <div className="app-list-row">
                    <div className="app-list-section">
                        <div className="category-title">Social</div>
                        <div className="app-list">
                            {socialApps}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class App extends React.Component {
    updateSelectedApp(app) {
        this.props.updateSelectedApp(app);
    }

    render() {
        const app = this.props.app;
        return (
            <div className="app" tabIndex={this.props.showMessage ? "-1" : "0"} style={{backgroundColor: app.color}} onClick={() => this.props.updateSelectedApp(app)}>
                <img className="app-logo" src={app.logo}/>
                <span className="app-name">{app.name}</span>
            </div>
        )
    }
}
class ExternalApp extends React.Component {
    constructor(props) {
        super(props);
        this.handleMessageVisibility = this.handleMessageVisibility.bind(this);
    }

    handleMessageVisibility(destination) {
        this.props.updateMessageState(destination);
    }

    render() {
        const app = this.props.app;
        const destination = app.destination;
        return (
            <div>
                <div className="app" tabIndex={this.props.showMessage ? "-1" : "0"} style={{ backgroundColor: app.color }} onClick={() => this.handleMessageVisibility(destination)}>
                    <img className="app-logo" src={app.logo}/>
                    <span className="app-name">{app.name}</span>
                </div>
            </div>
        )
    }
}

class PopupMessage extends React.Component {
    render() {
        return (
            <div id="popup-message-container" className={`popup-message-container${this.props.showMessage ? " active" : ""}`}>
                <div className="popup-message">
                    <div className="popup-message-content">
                        <div className="popup-description">You're about to open a new tab! Would you like to continue?</div>
                        <div className="button-container">
                            <span className="button" tabIndex="0" onClick={this.props.handleMessageVisibility}>Return</span>
                            <a className="button" href={this.props.destination} target="_blank" onClick={this.props.handleMessageVisibility}>Proceed</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Portfolio
