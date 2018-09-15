import React from 'react';
import { Divider, Segment, Button, Icon, Table, Menu, Label, Modal, Form, Select } from 'semantic-ui-react';
import { User } from '../../services/requests';
import { inspect } from '../../services/utilities';

export default class UserSub extends React.Component {

    state = {
        users: [],
        total: 0,
        limit: 10,
        offset: 0,
        curPage: 1,
        popupAdd: false
    }

    componentDidMount() {
        this._loadUserData();
    }

    _loadUserData() {
        let { limit, offset } = this.state;
        this._setLoading(true, 'Mengambil data pengguna..');
        User.index(limit, offset).then((res) => {
            this.setState({ users: res.data.rows, total: res.data.count });
            this._setLoading(false);
        });
    }

    _setLoading(loading, loadingText) {
        this.props.setLoading(loading, loadingText);
    }

    _onAddPopup() {
        this.setState({ popupAdd: true });
    }

    _onSubmitAdd(e) {
        let data = inspect(e.target);
        console.log(data);
    }

    _switchPage(page) {
        this.setState({
            offset: this.state.limit * page,
            curPage: page + 1
        }, this._loadUserData.bind(this));
    }

    render() {
        const { users, total, limit, curPage, popupAdd } = this.state;
        const pageButtons = [];
        for (let i = 0; i < Math.ceil(total / limit); i++) {
            pageButtons.push(
                <Menu.Item active={i + 1 === curPage} as='a' key={i} onClick={() => this._switchPage(i)}>{i + 1}</Menu.Item>
            );
        }
        return (
            <div>
                <Segment>
                    <Divider />
                    <h2>Manajemen Pengguna</h2>
                    <Divider />
                    <Button animated="vertical" color="green" onClick={this._onAddPopup.bind(this)}>
                        <Button.Content hidden>Tambah</Button.Content>
                        <Button.Content visible>
                            <Icon name="plus" />
                        </Button.Content>
                    </Button>
                    <Divider />
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Nama</Table.HeaderCell>
                                <Table.HeaderCell>Bergabung</Table.HeaderCell>
                                <Table.HeaderCell>Level</Table.HeaderCell>
                                <Table.HeaderCell>Pilihan</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {(users.map((user, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell>{user.name}</Table.Cell>
                                    <Table.Cell>{user.created_at}</Table.Cell>
                                    <Table.Cell>
                                        <Label ribbon={user.type === 'Administrator'} color={user.type === 'Administrator' ? 'orange' : 'grey'}>{user.type}</Label>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button animated color="green" basic>
                                            <Button.Content hidden>Edit</Button.Content>
                                            <Button.Content visible>
                                                <Icon name="edit" />
                                            </Button.Content>
                                        </Button>
                                        <Button animated color="red" basic>
                                            <Button.Content hidden>Hapus</Button.Content>
                                            <Button.Content visible>
                                                <Icon name="trash" />
                                            </Button.Content>
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )))}
                        </Table.Body>

                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan='4'>
                                    {(pageButtons.length > 1) && (
                                        <Menu floated='right' pagination>
                                            <Menu.Item disabled={this.state.curPage === 1} onClick={() => {
                                                this._switchPage(this.state.curPage - 1 - 1);
                                            }} as='a' icon>
                                                <Icon name='chevron left' />
                                            </Menu.Item>
                                            {pageButtons}
                                            <Menu.Item disabled={this.state.curPage === Math.ceil(total / limit)} onClick={() => {
                                                this._switchPage(this.state.curPage - 1 + 1);
                                            }} as='a' icon>
                                                <Icon name='chevron right' />
                                            </Menu.Item>
                                        </Menu>
                                    )}
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </Segment>

                {/* Add Popup */}
                <Modal open={popupAdd} onClose={() => this.setState({ popupAdd: false })} closeIcon>
                    <Modal.Header>Tambah Pengguna Baru</Modal.Header>
                    <Modal.Content>
                        <Form method="post" onSubmit={this._onSubmitAdd.bind(this)}>
                            <Form.Field>
                                <label>Nama</label>
                                <input required name="name" placeholder='Nama' />
                            </Form.Field>
                            <Form.Field>
                                <label>Username</label>
                                <input required name="username" placeholder='Nama' />
                            </Form.Field>
                            <Form.Field>
                                <label>Password</label>
                                <input required name="password" type="password" placeholder='Nama' />
                            </Form.Field>
                            <Form.Field>
                                <label>Level</label>
                                <Select required fluid name="type" placeholder='Tipe Data' options={[
                                    { key: 0, value: 'Administrator', text: 'Administrator' },
                                    { key: 1, value: 'Surveyor', text: 'Surveyor' }
                                ]} />
                            </Form.Field>
                            <Divider />
                            <Button type="submit">Simpan</Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }

}