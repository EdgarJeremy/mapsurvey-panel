import React from 'react';
import { Container, Segment, Menu, Icon, Button } from 'semantic-ui-react';
import { Link, Switch, Route } from 'react-router-dom';
import ObjectSub from './subpages/ObjectSub';
import { Public } from '../services/requests';
import Wait from '../components/Wait';
import UserSub from './subpages/UserSub';

export default class Panel extends React.Component {

    state = {
        loading: true,
        loadingText: 'Mengecek session..'
    }

    componentDidMount() {
        document.title = "Panel MapSurvey";
        let { history } = this.props;
        Public.check().then((res) => {
            if (!res.status) {
                history.push('/');
            } else {
                this._setLoading(false);
            }
        });
    }

    _setLoading(loading, loadingText) {
        this.setState({ loading, loadingText });
    }

    _onLogout() {
        let { history } = this.props;
        this._setLoading(true, 'Menghubungi server..');
        Public.logout().then(() => {
            this._setLoading(false);
            history.push('/');
        });
    }

    _currentRoute() {
        let path = this.props.location.pathname;
        let thispath = this.props.match.path;
        return path.replace(thispath, '');
    }

    render() {
        const { loading, loadingText } = this.state;
        this._currentRoute();
        return (
            <div className="container-panel">
                <Wait visible={loading} text={loadingText} />
                <Container>
                    {/* Header */}
                    <Segment stacked>
                        <h1 style={{ textAlign: 'center' }}>MapSurvey Panel</h1>
                    </Segment>
                    {/* Menu */}
                    <Menu pointing inverted>
                        <Menu.Item content={(<Link to={`${this.props.match.path}/`}>Objek</Link>)} active={this._currentRoute() === '/' || this._currentRoute() === ''} />
                        <Menu.Item content={(<Link to={`${this.props.match.path}/users`}>Pengguna</Link>)} active={this._currentRoute() === '/users'} />
                        <Menu.Item content={(<Link to={`${this.props.match.path}/settings`}>Pengaturan</Link>)} active={this._currentRoute() === '/settings'} />
                        <Menu.Menu position="right">
                            <Menu.Item>
                                <Button animated color="red" onClick={this._onLogout.bind(this)}>
                                    <Button.Content visible>Keluar</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name="sign out" />
                                    </Button.Content>
                                </Button>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                    {/* Content */}
                    <Switch>
                        <Route exact path={`${this.props.match.path}/`} render={(props) => <ObjectSub {...props} setLoading={this._setLoading.bind(this)} />} />
                        <Route path={`${this.props.match.path}/users`} render={(props) => <UserSub {...props} setLoading={this._setLoading.bind(this)} />} />
                    </Switch>
                </Container>
            </div>
        );
    }

}