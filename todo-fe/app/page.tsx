/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Table, Button, Modal, Form, Input, Select, Tag, message, Card, Typography, Space, ColorPicker, Radio, List, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined, FolderAddOutlined, FilterOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { Color } from 'antd/es/color-picker';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

interface Category {
  id: number;
  name: string;
  color: string;
}

interface Todo {
  id: number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  category_id: number;
  category?: Category;
}

interface CategoryFormValues {
  name: string;
  color: string | Color; 
}

interface TodoFormValues {
  title: string;
  description: string;
  priority: string;
  category_id: number;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<number>(0); 
  const [searchText, setSearchText] = useState<string>(""); 
  const [formTodo] = Form.useForm();
  const [formCat] = Form.useForm();
  const fetchData = async (categoryId: number = 0, search: string = "") => {
    setLoading(true);
    try {
      let url = 'http://localhost:8080/api/todos?';
      
      if (categoryId !== 0) {
        url += `category_id=${categoryId}&`;
      }
      if (search) {
        url += `search=${search}`;
      }

      const resTodos = await axios.get(url);
      setTodos(resTodos.data.data);

      const resCats = await axios.get('http://localhost:8080/api/categories');
      setCategories(resCats.data.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filterCategory, searchText);
  }, []); 

  const handleFilterChange = (e: any) => {
    const val = e.target.value;
    setFilterCategory(val);
    fetchData(val, searchText);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchData(filterCategory, value);
  };

  const handleCreateCategory = async (values: CategoryFormValues) => {
    try {
      let colorHex = '';
      if (typeof values.color === 'string') {
        colorHex = values.color;
      } else {
        colorHex = values.color.toHexString();
      }
      
      await axios.post('http://localhost:8080/api/categories', {
        name: values.name,
        color: colorHex
      });
      message.success('Kategori berhasil dibuat!');
      formCat.resetFields();
      
      const resCats = await axios.get('http://localhost:8080/api/categories');
      setCategories(resCats.data.data);
      
    } catch (error) {
        console.error(error);
        message.error('Gagal buat kategori');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`);
      message.success('Kategori dihapus!');
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            console.log("Data kategori tidak ditemukan (404), membersihkan tampilan lokal...");
        } else {
            console.error(error);
            message.error('Gagal menghapus kategori');
        }
    }

    try {
        const resCats = await axios.get('http://localhost:8080/api/categories');
        setCategories(resCats.data.data);
        if (filterCategory === id) {
            setFilterCategory(0);
            fetchData(0, searchText);
        } else {
            fetchData(filterCategory, searchText);
        }
    } catch (refetchError) {
        console.error("Gagal refresh data setelah hapus:", refetchError);
    }
  };

  const handleSubmitTodo = async (values: TodoFormValues) => {
    try {
      if (editingTodo) {
        await axios.put(`http://localhost:8080/api/todos/${editingTodo.id}`, values);
        message.success('Tugas diperbarui!');
      } else {
        await axios.post('http://localhost:8080/api/todos', values);
        message.success('Tugas dibuat!');
      }
      
      setIsTodoModalOpen(false);
      setEditingTodo(null);
      formTodo.resetFields();
      fetchData(filterCategory, searchText);

    } catch (error) {
        console.error(error);
        message.error('Gagal menyimpan tugas');
    }
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    formTodo.setFieldsValue({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      category_id: todo.category_id
    });
    setIsTodoModalOpen(true);
  }

  const openCreateModal = () => {
    setEditingTodo(null);
    formTodo.resetFields();
    setIsTodoModalOpen(true);
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`);
      message.success('Tugas dihapus');
      fetchData(filterCategory, searchText);
    } catch (error) {
        console.error(error);
        message.error('Gagal menghapus tugas');
    }
  };

  const handleToggle = async (todo: Todo) => {
    try {
      await axios.put(`http://localhost:8080/api/todos/${todo.id}`, {
        completed: !todo.completed
      });
      message.success('Status diperbarui');
      fetchData(filterCategory, searchText);
    } catch (error) {
        console.error(error);
        message.error('Gagal update status');
    }
  };

  const columns = [
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_: unknown, record: Todo) => (
        <Tag color={record.completed ? 'success' : 'warning'}>
          {record.completed ? 'Selesai' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Kategori',
      key: 'category',
      width: 120,
      render: (_: unknown, record: Todo) => (
        record.category && record.category.id !== 0 ? (
          <Tag color={record.category.color}>{record.category.name}</Tag>
        ) : (
          <Tag>Umum</Tag>
        )
      ),
    },
    {
      title: 'Judul Tugas',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Todo) => (
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            textDecoration: record.completed ? 'line-through' : 'none',
            color: record.completed ? '#999' : '#000'
          }}>
            {text}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Prioritas',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => {
        const colors: Record<string, string> = { high: 'red', medium: 'orange', low: 'blue' };
        return <Tag color={colors[priority] || 'default'}>{priority?.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 150,
      render: (_: unknown, record: Todo) => (
        <Space>
          <Button 
            type={record.completed ? "default" : "primary"} 
            shape="circle"
            icon={<CheckOutlined />} 
            size="small"
            onClick={() => handleToggle(record)}
            title="Tandai Selesai"
          />
          <Button 
            shape="circle"
            icon={<EditOutlined />} 
            size="small"
            onClick={() => openEditModal(record)}
            title="Edit Tugas"
          />
          <Popconfirm
            title="Hapus tugas ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Batal"
          >
            <Button 
                danger 
                shape="circle"
                icon={<DeleteOutlined />} 
                size="small"
                title="Hapus"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#1890ff', padding: '0 24px', display: 'flex', alignItems: 'center', width: '100%' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>To-Do App</Title>
      </Header>
      <Content style={{ padding: '24px', width: '100%' }}>
        <Card style={{ marginBottom: '16px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FilterOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontWeight: 'bold' }}>Filter:</span>
                    <Radio.Group 
                        value={filterCategory} 
                        onChange={handleFilterChange}
                        buttonStyle="solid"
                        size="middle"
                    >
                        <Radio.Button value={0}>Semua</Radio.Button>
                        {categories.map(cat => (
                            <Radio.Button key={cat.id} value={cat.id}>
                                {cat.name}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                  </div>
                  <Input.Search 
                    placeholder="Cari tugas..." 
                    onSearch={handleSearch}
                    style={{ width: 250 }}
                    allowClear
                  />
              </div>
              <Space>
                <Button icon={<FolderAddOutlined />} onClick={() => setIsCatModalOpen(true)}>
                    Kelola Kategori
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    Tambah Tugas
                </Button>
              </Space>
          </div>
        </Card>
        <Card title="Daftar Tugas Saya" style={{ width: '100%' }}>
          <Table 
            dataSource={todos} 
            columns={columns} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }} 
            scroll={{ x: true }} 
          />
        </Card>
        <Modal 
          title={editingTodo ? "Edit Tugas" : "Tambah Tugas Baru"} 
          open={isTodoModalOpen} 
          onCancel={() => {
          setIsTodoModalOpen(false);
          setEditingTodo(null);
          }}
          footer={null}
        >
          <Form form={formTodo} onFinish={handleSubmitTodo} layout="vertical">
            <Form.Item name="title" label="Judul Tugas" rules={[{ required: true }]}>
              <Input placeholder="Contoh: Belajar Golang" />
            </Form.Item>
            <Form.Item name="description" label="Deskripsi">
              <Input.TextArea placeholder="Detail tugas..." />
            </Form.Item>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item name="priority" label="Prioritas" initialValue="medium" style={{ flex: 1 }}>
                <Select>
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                </Select>
              </Form.Item>
              <Form.Item name="category_id" label="Kategori" style={{ flex: 1 }} rules={[{ required: true, message: 'Pilih kategori!' }]}>
                <Select placeholder="Pilih Kategori">
                  {categories.map(cat => (
                    <Option key={cat.id} value={cat.id}>
                      <span style={{ color: cat.color }}>●</span> {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {editingTodo ? "Simpan Perubahan" : "Buat Tugas"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Kelola Kategori"
          open={isCatModalOpen}
          onCancel={() => setIsCatModalOpen(false)}
          footer={null}
        >
          <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
            <Title level={5}>Buat Kategori Baru</Title>
            <Form form={formCat} onFinish={handleCreateCategory} layout="vertical">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
                    <Form.Item name="name" label="Nama" style={{ flex: 1, marginBottom: 0 }} rules={[{ required: true }]}>
                        <Input placeholder="Nama Kategori" />
                    </Form.Item>
                    <Form.Item name="color" label="Warna" initialValue="#1677ff" style={{ marginBottom: 0 }}>
                        <ColorPicker />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                        Simpan
                    </Button>
                </div>
            </Form>
          </div>
          <Title level={5}>Daftar Kategori</Title>
          <List
            itemLayout="horizontal"
            dataSource={categories}
            renderItem={(item) => (
              <List.Item
                actions={[
                    <Popconfirm
                        key="delete"
                        title="Hapus kategori ini?"
                        description="Tugas di kategori ini akan menjadi 'Umum'."
                        onConfirm={() => handleDeleteCategory(item.id)}
                        okText="Ya"
                        cancelText="Batal"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                ]}
              >
                <List.Item.Meta
                  avatar={<div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: item.color }}></div>}
                  title={item.name}
                />
              </List.Item>
            )}
          />
        </Modal>
      </Content>
    </Layout>
  );
}