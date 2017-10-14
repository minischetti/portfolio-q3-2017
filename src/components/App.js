import React from 'react'
import apps from './apps.json'

class Portfolio extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedApp: apps.professional[0] };
        this.updateSelectedApp = this.updateSelectedApp.bind(this);
    }

    updateSelectedApp(selectedApp) {
        this.setState({selectedApp});
    }

    render() {
        const selectedApp = this.state.selectedApp;
        return (
            <div id="portfolio" className="portfolio">
                <ExpandedApp selectedApp={this.state.selectedApp}/>
                <AppList selectedApp={this.state.selectedApp} updateSelectedApp={this.updateSelectedApp}/>
                <div className="background-image-blurred" style={{backgroundImage: `url(${selectedApp.background})`}}></div>
            </div>
        )
    }
}

class ExpandedApp extends React.Component {
    render() {
        const selectedApp = this.props.selectedApp;
        const technology = selectedApp.technology.map((technology) =>
            <span key={technology}>{technology}</span>
        );
        return (
            <div className="expanded-app">
                <div className="expanded-app-content">
                    <div className="side-bar">
                        <span className="label">Position</span>
                        <span>{selectedApp.position}</span>
                        <span className="label">Technology</span>
                        {technology}
                    </div>
                    <div className="app-info">
                        <img className="expanded-app-logo" src={selectedApp.altLogo}/>
                        <div className="location-and-duration">
                            <span className="label">Location</span>
                            <span>{selectedApp.location}</span>
                            <span className="label">Duration</span>
                            <span>{selectedApp.duration}</span>
                        </div>
                        <p>{selectedApp.description}</p>
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
            <App key={app.id} app={app} selectedApp={this.props.selectedApp} updateSelectedApp={this.props.updateSelectedApp}/>
        );
        const personalApps = apps.personal.map((app) =>
            <App key={app.id} app={app} selectedApp={this.props.selectedApp} updateSelectedApp={this.props.updateSelectedApp}/>
        );
        const socialApps = apps.social.map((app) =>
            <ExternalApp key={app.id} app={app}/>
        );
        const selectedApp = this.props.selectedApp;
        return (
            <div className="app-list-container">
                <div className="app-list-row">
                    <div className="app-list-section">
                        <span className="category-title">Big Budget</span>
                        <div className="app-list">
                            {professionalApps}
                        </div>
                    </div>
                    <div className="app-list-section">
                        <span className="category-title">Indie</span>
                        <div className="app-list">
                            {personalApps}
                        </div>
                    </div>
                </div>
                <div className="app-list-row">
                    <div className="app-list-section">
                        <span className="category-title">Social</span>
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
    // constructor(props) {
    //     super(props);
    //     this.updateSelectedApp = this.updateSelectedApp.bind(this);
    //     this.isSelectedApp = this.isSelectedApp.bind(this);
    //     this.state = { isSelectedApp: false };
    // }

    // isSelectedApp() {
    //     return this.props.selectedApp == this.props.app;
    // }
    //
    // componentDidMount() {
    //     const isSelected = this.isSelectedApp();
    //     if(isSelected) {
    //         this.setState({isSelectedApp: true});
    //     }
    // }
    //
    // shouldComponentUpdate(nextProps, nextState) {
    //     if(this.state.isSelectedApp !== nextState.isSelectedApp) {
    //         return true;
    //     }
    //     return false;
    // }
    //
    // componentWillReceiveProps() {
    //     const isSelected = this.isSelectedApp();
    //     if (isSelected) {
    //         this.setState({ isSelectedApp: true });
    //     } else {
    //         this.setState({ isSelectedApp: false });
    //     }
    // }


    updateSelectedApp(app) {
        this.props.updateSelectedApp(app);
        // this.setState({isSelectedApp: !this.state.isSelectedApp});
        // return (this.props.selectedApp == app);
    }

    render() {
        const app = this.props.app;
        return (
            <div className="app" style={{backgroundColor: app.color}} onClick={() => this.props.updateSelectedApp(app)}>
                <img className="app-logo" src={app.logo}/>
                <span className="app-name">{app.name}</span>
            </div>
        )
    }
}
class ExternalApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showMessage: false };
        this.handleMessageVisibility = this.handleMessageVisibility.bind(this);
    }

    handleMessageVisibility() {
        const popup = document.getElementById("popup-message-container");
        this.setState({ showMessage: !this.state.showMessage })
        document.body.classList.toggle("no-scroll");
        // popup.classList.toggle("active");

    }

    render() {
        const app = this.props.app;
        const showMessage = this.state.showMessage;
        return (
            <div>
                <div className="app" target="_blank" style={{backgroundColor: app.color}} onClick={() => this.handleMessageVisibility()}>
                    <img className="app-logo" src={app.logo}/>
                    <span className="app-name">{app.name}</span>
                </div>
                {showMessage && <PopupMessage destination={app.destination} handleMessageVisibility={this.handleMessageVisibility}/>}
            </div>
        )
    }
}

class PopupMessage extends React.Component {
    // componentDidMount() {
    //     const popup = document.getElementById("popup-message-container");
    //     setTimeout(function() {
    //         popup.classList.add("active");
    //     }, 500);
    // }

    // componentWillUnmount() {
    //     const popup = document.getElementById("popup-message-container");
    //     popup.classList.remove("active");
    //     setTimeout(function() {
    //         return true;
    //     }, 500);
    // }
    render() {
        return (
            <div id="popup-message-container" className="popup-message-container">
                <div className="popup-message">
                    <div className="popup-message-content">
                        <div className="popup-description">This app leads to an external site. Would you like to continue?</div>
                        <div className="button-container">
                            <a className="button" href={this.props.destination} target="_blank" onClick={this.props.handleMessageVisibility}>Proceed</a>
                            <span className="button" onClick={this.props.handleMessageVisibility}>Return</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Portfolio
