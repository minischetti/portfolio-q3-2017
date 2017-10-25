import React from 'react'
import apps from './apps.json'

class Portfolio extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedApp: apps.professional[0], showLoadingScreen: true, showMessage: false, showBio: false, externalLink: "" };
        this.updateSelectedApp = this.updateSelectedApp.bind(this);
        this.updateMessageState = this.updateMessageState.bind(this);
        this.handleMessageVisibility = this.handleMessageVisibility.bind(this);
        this.handleBioVisibility = this.handleBioVisibility.bind(this);
        this.animateApps = this.animateApps.bind(this);
        this.fetchAsset = this.fetchAsset.bind(this);
        this.generatePortfolioClasses = this.generatePortfolioClasses.bind(this);
    }

    toggleLoadingScreen() {
        this.setState({showLoadingScreen: !this.state.showLoadingScreen});
    }

    animateApps() {
        const apps = document.querySelectorAll(".app");
        const appLabels = document.querySelectorAll(".category-title");
        let delay = 1.5;
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

    handleBioVisibility() {
        this.setState({ showBio: !this.state.showBio});
    }

    fetchAsset(type, app) {
        switch (type) {
            case "background":
                return `assets/backgrounds/${app}.jpg`;
            case "backgroundBlurred":
                return `assets/backgrounds/${app}-blurred.jpg`;
            case "logo":
                return `assets/logos/${app}.svg`;
            case "logoAlt":
                return `assets/logos/${app}-alt.svg`;
        }
    }

    generatePortfolioClasses() {
        if (this.state.showLoadingScreen) {
            return "loading-screen-visible";
        } else if (this.state.showBio) {
            return "bio-visible"
        }
        return;
    }

    render() {
        const selectedApp = this.state.selectedApp;
        const showLoadingScreen = this.state.showLoadingScreen;
        const showBio = this.state.showBio;
        const showMessage = this.state.showMessage;
        const destination = this.state.externalLink;
        const professionalApps = apps.professional.map((app) =>
            <ExpandedApp key={app.id} app={app} updateMessageState={this.updateMessageState} fetchAsset={this.fetchAsset}/>
        );
        const personalApps = apps.personal.map((app) =>
            <ExpandedApp key={app.id} app={app} updateMessageState={this.updateMessageState} fetchAsset={this.fetchAsset}/>
        );
        const bio = apps.bio.map((app) =>
            <Bio key={app.id} app={app}/>
        );
        const professionalAppsBackground = apps.professional.map((app) =>
            <BackgroundImage key={app.id} app={app} selectedApp={selectedApp} fetchAsset={this.fetchAsset}/>
        );
        const personalAppsBackground = apps.personal.map((app) =>
            <BackgroundImage key={app.id} app={app} selectedApp={selectedApp} fetchAsset={this.fetchAsset}/>
        );
        const bioBackground = apps.bio.map((app) =>
            <BackgroundImage key={app.id} app={app} selectedApp={selectedApp} fetchAsset={this.fetchAsset}/>
        );
        return (
            <div className="portfolio-container">
                <LoadingScreen showLoadingScreen={showLoadingScreen}/>
                <PopupMessage destination={destination} handleMessageVisibility={this.handleMessageVisibility} showMessage={showMessage}/>
                <div className="bio-switch-container">
                    <div className={`bio-switch${showBio ? " bio-visible" : ""}`} onClick={() => this.handleBioVisibility()}></div>
                </div>
                <div id="portfolio" className={`portfolio ${this.generatePortfolioClasses()}`}>
                    <div className="expanded-app-container" style={{ transform: `translateX(${selectedApp.xPos})` }}>
                        {professionalApps}
                        {personalApps}
                    </div>
                    <div className="background-image-carousel" style={{ transform: `translateX(${selectedApp.xPos})` }}>
                        {professionalAppsBackground}
                        {personalAppsBackground}
                    </div>
                    <AppList selectedApp={this.state.selectedApp} updateSelectedApp={this.updateSelectedApp} updateMessageState={this.updateMessageState} showMessage={showMessage} fetchAsset={this.fetchAsset}/>
                </div>
                <Bio showBio={this.state.showBio}/>
            </div>
        )
    }
}

class BackgroundImage extends React.Component {
    render() {
        const app = this.props.app;
        const selectedApp = this.props.selectedApp;
        return (
            <div className="background-image-container">
                <div className="upper-half-container">
                    <div className="upper-half-image" style={{ backgroundImage: `url(${this.props.fetchAsset("background", app.id)})` }}></div>
                </div>
                <div className="bottom-half-container" style={{ backgroundImage: `url(${this.props.fetchAsset("backgroundBlurred", app.id)})` }}></div>
            </div>
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

class Bio extends React.Component {
    render() {
        const bio = apps.bio[0];
        const skills = bio.skills.map((skills) =>
            <span key={skills}>{skills}</span>
        );
        return (
            <div className={`bio${this.props.showBio ? " active" : ""}`}>
                <img className="expanded-app-logo" src={bio.altLogo} />
                <div className="expanded-app-content">
                    <div className="side-bar">
                        <span className="label">Role</span>
                        <span>{bio.role}</span>
                        <span className="label">Skills</span>
                        {skills}
                    </div>
                    <div className="app-info">
                        <div className="location-and-duration">
                            <span className="label">Location</span>
                            <span>{bio.location}</span>
                        </div>
                        <p>{bio.description}</p>
                    </div>
                </div>
            </div>
        )
    }
}

class ExpandedApp extends React.Component {
    render() {
        const selectedApp = this.props.app;
        const destination = selectedApp.destination;
        const technology = selectedApp.technology.map((technology) =>
            <span key={technology}>{technology}</span>
        );
        return (
            <div className={`expanded-app ${selectedApp.id}`}>
                <img className="expanded-app-logo" src={this.props.fetchAsset("logoAlt", selectedApp.id)}/>
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
                        <div className="button button-small" onClick={() => this.props.updateMessageState(destination)}>View Website</div>
                    </div>
                </div>
            </div>
        )
    }
}

class AppList extends React.Component {
    render() {
        const professionalApps = apps.professional.map((app) =>
            <App key={app.id} app={app} appType="internal" selectedApp={this.props.selectedApp} updateSelectedApp={this.props.updateSelectedApp} fetchAsset={this.props.fetchAsset}/>
        );
        const personalApps = apps.personal.map((app) =>
            <App key={app.id} app={app} appType="internal" selectedApp={this.props.selectedApp} updateSelectedApp={this.props.updateSelectedApp} fetchAsset={this.props.fetchAsset}/>
        );
        const socialApps = apps.social.map((app) =>
            <App key={app.id} app={app} appType="external" updateMessageState={this.props.updateMessageState} showMessage={this.props.showMessage} fetchAsset={this.props.fetchAsset}/>
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
    determineAppType(appType) {
        const app = this.props.app;
        const destination = app.destination;
        switch(appType) {
            case "internal":
                this.props.updateSelectedApp(app);
                break;
            case "external":
                this.props.updateMessageState(destination);
                break;
        }
    }

    render() {
        const app = this.props.app;
        return (
            <div className="app" tabIndex={this.props.showMessage ? "-1" : "0"} style={{backgroundColor: app.color}} onClick={() => this.determineAppType(this.props.appType)}>
                <img className="app-logo" src={this.props.fetchAsset("logo", app.id)}/>
                <span className="app-name">{app.name}</span>
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
