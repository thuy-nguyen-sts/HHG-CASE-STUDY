import React, { useCallback, useEffect, useState } from 'react';
import {
  Table,
  Input,
  Popconfirm,
  Form,
  Typography,
  Button,
} from 'antd';
import axios from 'axios';

interface DataType {
  id: string;
  name: string;
  email: string;
  position: string;
}

interface EditableCellType {
  editing: boolean;
  editingKey: string;
  dataIndex: string;
  title: string;
  inputType: string | undefined;
  record: DataType;
  index: any;
  children: React.ReactNode;
}

const EditableCell = ({
  editing,
  editingKey,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}: EditableCellType) => {
  
  return (
    <td {...restProps}>
      {(editing && record?.id !== '0') ||
      (record?.id === '0' && !editingKey) ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
            {
              type: inputType as any, message: "Please enter the correct format" 
            }
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TableComponent = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([] as DataType[]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(false);

  const getEmployees = useCallback(() => {
    setLoading(true);
    axios
      .get(`https://608986478c8043001757f00e.mockapi.io/api/user?sortBy=createdDate&order=desc`)
      .then((res) => {
        setData([{ id: '0', name: '', email: '', position: '' }, ...res.data]);
        setLoading(false);
      });
  }, [])

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const isEditing = (record: DataType) => record.id === editingKey;

  const edit = async (record: DataType) => {
    form.setFieldsValue(record);
    setEditingKey(record.id);
  };

  const addNew = async () => {
    const row = await form.validateFields();
    axios
      .post(`https://608986478c8043001757f00e.mockapi.io/api/user`, {...row, createdDate: new Date()})
      .then(() => {
        getEmployees();
        form.setFieldsValue({
          name: '',
          email: '',
          position: '',
        });
      });
  };

  const cancel = () => {
    setEditingKey('');
    form.setFieldsValue({
      name: '',
      email: '',
      position: '',
    });
  };

  const handleDeleteRecord = (id: string) => {
    setLoading(true);
    axios
      .delete(`https://608986478c8043001757f00e.mockapi.io/api/user/${id}`)
      .then((res) => {
        const newData = [...data];
        const index = newData.findIndex((item) => id === item.id);
        if (index > -1) {
          newData.splice(index, 1);
        }
        setData(newData);
        setLoading(false);
      });
  };

  const save = async (key: string) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
      setLoading(true);
      axios
        .put(
          `https://608986478c8043001757f00e.mockapi.io/api/user/${editingKey}`,
          row
        )
        .then((res) => {
          if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
          } else {
            newData.push(row);
          }
          form.setFieldsValue({
            name: '',
            email: '',
            position: '',
          });
          setData(newData);
          setEditingKey('');
          setLoading(false);
        });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '35%',
      editable: true,
    },
    {
      title: 'Position',
      dataIndex: 'position',
      width: '20%',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      align: 'center',
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        if (record.id === '0') {
          return (
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => addNew()}
            >
              + Add New
            </Typography.Link>
          );
        }
        return editable ? (
          <span>
            <Button type="link" onClick={() => save(record.id)}>
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              style={{paddingRight: 10}}
            >
              Edit
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDeleteRecord(record.id)}
            >
              <Typography.Link disabled={editingKey !== ''}>Delete</Typography.Link>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex === 'email' ? 'email' : '',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        editingKey
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        loading={loading}
        rowKey="id"
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          defaultPageSize: 5,
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default TableComponent;
