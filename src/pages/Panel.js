import React from 'react';
import { Container, Segment, Menu, Icon, Button, Card, Form, Divider, Modal, Grid, Select, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Public, Objects } from '../services/requests';
import Wait from '../components/Wait';
import swal from 'sweetalert';

export default class Panel extends React.Component {

    state = {
        loading: true,
        objects: [],
        addFields: [{ name: 'name', type: 'string' }],
        addObjectName: '',
        popupAdd: false
    }

    componentDidMount() {
        document.title = "Panel MapSurvey";
        let { history } = this.props;
        Public.check().then((res) => {
            if (!res.status) {
                history.push('/');
            } else {
                this._fetchObjects();
                this._setLoading(false);
            }
        });
    }

    _fetchObjects() {
        Objects.index().then((res) => {
            this.setState({
                objects: res.data.rows
            });
        });
    }

    _setLoading(loading) {
        this.setState({ loading });
    }

    _onAddPopup() {
        this.setState({ popupAdd: true });
    }

    _onChangeAddFieldName(e, i) {
        let { addFields } = this.state;
        addFields[i].name = e.target.value;
        this.setState({ addFields });
    }

    _onChangeAddFieldType(e, t, i) {
        let { addFields } = this.state;
        addFields[i].type = t.value;
        this.setState({ addFields });
    }

    _onSubmitAdd(e) {
        let data = {
            type: this.state.addObjectName,
            fields: {}
        };
        this.state.addFields.forEach((field) => {
            data.fields[field.name] = field.type;
        });
        this._setLoading(true);
        Objects.save(data).then((res) => {
            if (res.status) {
                swal('Konfirmasi', 'Data berhasil disimpan', 'success');
            } else {
                swal('Error', 'Data gagal disimpan', 'error');
            }
            this.setState({ popupAdd: false });
            this._fetchObjects();
            this._setLoading(false);
        });
    }

    _onDeleteObject(id) {
        swal({
            title: "Anda yakin?",
            text: "Anda akan menghapus objek ini",
            icon: "warning",
            buttons: [
                'Tidak',
                'Ya'
            ],
            dangerMode: true,
        }).then((isConfirm) => {
            if(isConfirm) {
                this._setLoading(true);
                Objects.delete(id).then((res) => {
                    if (res.status) {
                        swal('Konfirmasi', 'Data berhasil dihapus', 'success');
                    } else {
                        swal('Error', 'Data gagal disimpan', 'error');
                    }
                    this.setState({ popupAdd: false });
                    this._fetchObjects();
                    this._setLoading(false);
                });
            }
        });
    }

    _onLogout() {
        let { history } = this.props;
        this._setLoading(true);
        Public.logout().then((res) => {
            this._setLoading(false);
            history.push('/');
        });
    }

    render() {
        const { loading, objects, popupAdd, addFields } = this.state;

        return (
            <div className="container-panel">
                <Wait visible={loading} />
                <Container>
                    <Segment stacked>
                        <h1 style={{ textAlign: 'center' }}>MapSurvey</h1>
                    </Segment>
                    <Menu pointing inverted>
                        <Menu.Item content={(<Link to="/">Objek</Link>)} active={true} />
                        <Menu.Item content={(<Link to="/">Pengguna</Link>)} active={false} />
                        <Menu.Item content={(<Link to="/">Pengaturan</Link>)} active={false} />
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Button animated color="red" onClick={this._onLogout.bind(this)}>
                                    <Button.Content visible>Keluar</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='sign out' />
                                    </Button.Content>
                                </Button>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                    <Segment>
                        <Divider />
                        <h2>Second Header</h2>
                        <Divider />
                        <Button animated='vertical' color="green" onClick={this._onAddPopup.bind(this)}>
                            <Button.Content hidden>Tambah</Button.Content>
                            <Button.Content visible>
                                <Icon name='plus' />
                            </Button.Content>
                        </Button>
                        <Button animated='vertical' color="blue">
                            <Button.Content hidden>List</Button.Content>
                            <Button.Content visible>
                                <Icon name='list' />
                            </Button.Content>
                        </Button>
                        <Divider />
                        <Card.Group>
                            {(objects.map((object, i) => (
                                <Card key={i}>
                                    <Card.Content>
                                        <Card.Header>{object.type}</Card.Header>
                                        <Card.Meta>Objek</Card.Meta>
                                        <Card.Description>
                                            {(Object.keys(object.fields).map((field, k) => {
                                                return (
                                                    <Label key={k} as='a'>{field} </Label>
                                                );
                                            }))}
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <div className='ui two buttons'>
                                            <Button animated='vertical' color="green" basic>
                                                <Button.Content visible>Edit</Button.Content>
                                                <Button.Content hidden>
                                                    <Icon name='edit' />
                                                </Button.Content>
                                            </Button>
                                            <Button animated='vertical' color="red" basic onClick={() => this._onDeleteObject(object.id)}>
                                                <Button.Content visible>Hapus</Button.Content>
                                                <Button.Content hidden>
                                                    <Icon name='trash' />
                                                </Button.Content>
                                            </Button>
                                        </div>
                                    </Card.Content>
                                </Card>
                            )))}
                        </Card.Group>
                    </Segment>
                </Container>
                <Modal open={popupAdd} onClose={() => this.setState({ popupAdd: false })} closeIcon>
                    <Modal.Header>Tambah Objek Baru</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this._onSubmitAdd.bind(this)}>
                            <Form.Field>
                                <label>Nama Objek</label>
                                <input onChange={(e) => {
                                    this.setState({
                                        addObjectName: e.target.value
                                    })
                                }} value={this.state.addObjectName} placeholder='Nama' />
                            </Form.Field>
                            <Form.Field>
                                <label>Fields</label>
                                <Grid columns={3} divided>
                                    {(addFields.map((field, i) => (
                                        <Grid.Row key={i}>
                                            <Grid.Column>
                                                <input required value={this.state.addFields[i].name} onChange={(e) => this._onChangeAddFieldName(e, i)} placeholder='Nama Field' />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Select required value={this.state.addFields[i].type} onChange={(e, t) => this._onChangeAddFieldType(e, t, i)} fluid placeholder='Tipe Data' options={[
                                                    { key: 0, value: 'string', text: 'String' },
                                                    { key: 1, value: 'number', text: 'Number' }
                                                ]} />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Button icon="times" fluid color="red" disabled={this.state.addFields.length === 1} onClick={() => {
                                                    let { addFields } = this.state;
                                                    addFields.splice(i, 1);
                                                    this.setState({ addFields });
                                                }} />
                                            </Grid.Column>
                                        </Grid.Row>
                                    )))}
                                </Grid>
                                <Divider />
                                <Button color="teal" icon="plus" onClick={() => {
                                    let { addFields } = this.state;
                                    addFields.push({
                                        name: '',
                                        type: ''
                                    });
                                    this.setState({ addFields });
                                }} />
                            </Form.Field>
                            <Button type='submit'>Submit</Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }

}