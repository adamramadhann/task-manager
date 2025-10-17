import { useState, useEffect } from "react";
import { Table, Tag, Avatar, message, Spin, Button, Space, Card, Form, Input, DatePicker, Select, Modal } from "antd";
import { Trash2, Plus, Edit } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs';

export const ProgressTeamPage = () => {
  type Status = 'Task Dibatalkan' | 'Sedang Dikerjakan' | 'Sedang Direvisi' | 'Blocked' | 'Selesai';

  interface ProgressData {
    id: string;
    penanggung_jawab: string;
    task: string;
    tanggalMulai: string;
    tanggal_selesai: string;
    status: Status;
    detail_aktivitas: string;
    tanggalDeadline: string;
  }

  interface TaskFormData {
    penanggung_jawab: string;
    task: string;
    tanggalMulai: string;
    tanggalDeadline: string;
    detail_aktivitas: string;
    status: Status;
  }

  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [filteredData, setFilteredData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ProgressData | null>(null);
  const [searchStatus, setSearchStatus] = useState<Status | 'all'>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [taskForm] = Form.useForm();

  const handleSubmitTask = async (values: TaskFormData) => {
    try {
      setFormLoading(true);

      if (editingTask) {
        const response = await fetch(`http://localhost:3000/api/task-updated/${editingTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            penanggung_jawab: values.penanggung_jawab,
            task: values.task,
            tanggalMulai: values.tanggalMulai,
            tanggalDeadline: values.tanggalDeadline,
            detail_aktivitas: values.detail_aktivitas,
            status: values.status
          })
        });

        if (response.ok) {
          message.success(`Berhasil update task: ${values.task}`);
          alert("Updated Success!")
          setProgressData(prev => 
            prev.map(item => 
              item.id === editingTask.id 
                ? { 
                    ...item, 
                    penanggung_jawab: values.penanggung_jawab,
                    task: values.task,
                    tanggalMulai: values.tanggalMulai,
                    tanggalDeadline: values.tanggalDeadline,
                    detail_aktivitas: values.detail_aktivitas,
                    status: values.status
                  }
                : item
            )
          );
        } else {
          const errorText = await response.text();
          throw new Error(errorText || 'Gagal update task');
        }
      } else {
        const response = await fetch('http://localhost:3000/api/task-created', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            penanggung_jawab: values.penanggung_jawab,
            task: values.task,
            tanggalMulai: values.tanggalMulai,
            tanggalDeadline: values.tanggalDeadline,
            detail_aktivitas: values.detail_aktivitas,
            status: values.status || 'Sedang Dikerjakan'
          })
        });

        if (response.ok) {
          const result = await response.json();
          alert("Created Success!")
          message.success('Task berhasil dibuat!');
          if (result.data) {
            setProgressData(prev => [result.data, ...prev]);
          } else {
            await fetchProgressData();
          }
        } else {
          const errorText = await response.text();
          throw new Error(errorText || 'Gagal membuat task');
        }
      }
      
      setShowTaskModal(false);
      setEditingTask(null);
      taskForm.resetFields();
      
    } catch (error: any) {
      console.error('Error submitting task:', error);
      message.error(error.message || `Gagal ${editingTask ? 'update' : 'membuat'} task`);
    } finally {
      setFormLoading(false);
    }
  };

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/get-task");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();  
      const data = result.data || result;
      
      if (Array.isArray(data)) {
        setProgressData(data);
        setFilteredData(data);
      } else {  
        setProgressData([]);
        setFilteredData([]);
      }
      
    } catch (error: any) { 
      message.error("Gagal mengambil data progress tim");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = progressData;

    if (searchStatus !== 'all') {
      filtered = filtered.filter(item => item.status === searchStatus);
    } 

    setFilteredData(filtered);
  };

  const handleStatusSearch = (status: Status | 'all') => {
    setSearchStatus(status);
  };

  const handleResetFilter = () => {
    setSearchStatus('all');
    setSearchText('');
  };

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Pilih setidaknya satu task untuk dihapus');
      return;
    }

    try {
      setDeleteLoading(true);
      
      const confirmDelete = window.confirm(
        `Apakah Anda yakin ingin menghapus ${selectedRowKeys.length} task?`
      );
      
      if (!confirmDelete) return;

      const response = await fetch('http://localhost:3000/api/task/delete-multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedRowKeys })
      });

      if (response.ok) {
        alert("Deleted Success!")
        message.success(`${selectedRowKeys.length} data berhasil dihapus`);
        setProgressData(prev => 
          prev.filter(item => !selectedRowKeys.includes(item.id))
        );
        setSelectedRowKeys([]);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal menghapus task');
      }
      
    } catch (error: any) {
      console.error('Error deleting tasks:', error);
      message.error(error.message || 'Gagal menghapus task');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openTaskModal = (task?: ProgressData) => {
    if (task) {
      setEditingTask(task);
      taskForm.setFieldsValue({
        penanggung_jawab: task.penanggung_jawab,
        task: task.task,
        tanggalMulai: task.tanggalMulai ? dayjs(task.tanggalMulai) : null,
        tanggalDeadline: task.tanggalDeadline ? dayjs(task.tanggalDeadline) : null,
        detail_aktivitas: task.detail_aktivitas,
        status: task.status
      });
    } else {
      setEditingTask(null);
      taskForm.setFieldsValue({
        status: 'Sedang Dikerjakan'
      });
    }
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    taskForm.resetFields();
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  const getStatusColor = (status: Status): string => {
    switch (status) {
      case 'Task Dibatalkan': return 'default';
      case 'Sedang Dikerjakan': return 'processing';
      case 'Sedang Direvisi': return 'warning';
      case 'Blocked': return 'error';
      case 'Selesai': return 'success';
      default: return 'default';
    }
  };

  const statusOptions = [
    { value: 'Task Dibatalkan', label: 'Task Dibatalkan' },
    { value: 'Sedang Dikerjakan', label: 'Sedang Dikerjakan' },
    { value: 'Sedang Direvisi', label: 'Sedang Direvisi' },
    { value: 'Blocked', label: 'Blocked' },
    { value: 'Selesai', label: 'Selesai' },
  ];

  const searchStatusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'Task Dibatalkan', label: 'Task Dibatalkan' },
    { value: 'Sedang Dikerjakan', label: 'Sedang Dikerjakan' },
    { value: 'Sedang Direvisi', label: 'Sedang Direvisi' },
    { value: 'Blocked', label: 'Blocked' },
    { value: 'Selesai', label: 'Selesai' },
  ];

  const columns: ColumnsType<ProgressData> = [
    {
      title: 'Penanggung Jawab',
      dataIndex: 'penanggung_jawab',
      key: 'penanggung_jawab',
      render: (text: string) => (
        <div className="flex items-center gap-3">
          <Avatar
            style={{ background: 'linear-gradient(to bottom right, #6366f1, #a855f7)' }}
          >
            {text.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <span className="font-medium text-gray-800">{text}</span>
        </div>
      ),
    },
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
    },
    {
      title: 'Periode',
      key: 'periode',
      render: (_, record) => (
        <div className="flex flex-col text-gray-600">
          <span>
              <b>Mulai: </b> 
              {new Date(record.tanggalMulai).toLocaleDateString("id-ID", { 
                day: "2-digit", 
                month: "short", 
                year: "numeric" 
              })}
          </span>
          <span>
            <b>Deadline: </b> 
            { 
              new Date(record.tanggalDeadline).toLocaleDateString("id-ID", { 
                day: "2-digit", 
                month: "short", 
                year: "numeric" 
              }) 
            } 
          </span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Detail Aktivitas',
      dataIndex: 'detail_aktivitas',
      key: 'detail_aktivitas',
    },
    {
      title: 'Aksi',
      key: 'aksi',
      render: (_, record) => (
        <Button
          type="link"
          icon={<Edit size={16} />}
          onClick={() => openTaskModal(record)}
          className="text-blue-600 hover:text-blue-800"
        >
          Edit
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchProgressData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchStatus, searchText, progressData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Progress Team</h1>
          <p className="text-gray-600">Pantau semua task dan progres tim Anda</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center h-64">
          <Spin size="large" />
          <span className="ml-4 text-gray-600">Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Progress Team</h1>
        <p className="text-gray-600">Pantau semua task dan progres tim Anda</p>
      </div>

      <Card className="rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="w-full md:w-48">
              <Select
                value={searchStatus}
                onChange={handleStatusSearch}
                className="w-full"
                options={searchStatusOptions}
              />
            </div>
            <Button
              onClick={handleResetFilter}
              disabled={searchStatus === 'all' && !searchText}
            >
              Reset Filter
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            Menampilkan {filteredData.length} dari {progressData.length} task
          </div>
        </div>
      </Card>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-4 flex justify-between items-center">
          <div>
            {selectedRowKeys.length > 0 && (
              <span className="text-gray-600">
                {selectedRowKeys.length} task terpilih
              </span>
            )}
          </div>
          
          <Space>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => openTaskModal()}
            >
              Tambah Task
            </Button>
            <Button
              type="primary"
              danger
              icon={<Trash2 size={16} />}
              onClick={handleDeleteSelected}
              disabled={selectedRowKeys.length === 0}
              loading={deleteLoading}
            >
              Hapus Selected ({selectedRowKeys.length})
            </Button>
          </Space>
        </div>

        <Table
          rowSelection={rowSelection}
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          loading={loading}
        />
      </div>

      <Modal
        title={editingTask ? "Edit Task" : "Tambah Task Baru"}
        open={showTaskModal}
        onCancel={closeTaskModal}
        footer={null}
        width={700}
      >
        <Form
          form={taskForm}
          layout="vertical"
          onFinish={handleSubmitTask}
          className="mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Penanggung Jawab"
              name="penanggung_jawab"
              rules={[{ required: true, message: 'Harap masukkan penanggung jawab' }]}
            >
              <Input placeholder="Masukkan nama penanggung jawab" />
            </Form.Item>

            <Form.Item
              label="Task"
              name="task"
              rules={[{ required: true, message: 'Harap masukkan task' }]}
            >
              <Input placeholder="Masukkan deskripsi task" />
            </Form.Item>

            <Form.Item
              label="Tanggal Mulai"
              name="tanggalMulai"
              rules={[{ required: true, message: 'Harap pilih tanggal mulai' }]}
            >
              <DatePicker 
                className="w-full" 
                format="YYYY-MM-DD"
                placeholder="Pilih tanggal mulai"
              />
            </Form.Item>

            <Form.Item
              label="Tanggal Deadline"
              name="tanggalDeadline"
              rules={[{ required: true, message: 'Harap pilih tanggal deadline' }]}
            >
              <DatePicker 
                className="w-full" 
                format="YYYY-MM-DD"
                placeholder="Pilih tanggal deadline"
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Harap pilih status' }]}
            >
              <Select
                className="w-full"
                placeholder="Pilih status"
                options={statusOptions}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Detail Aktivitas"
            name="detail_aktivitas"
            rules={[{ required: true, message: 'Harap masukkan detail aktivitas' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Masukkan detail aktivitas task"
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={closeTaskModal}>
                Batal
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={formLoading}
                icon={editingTask ? <Edit size={16} /> : <Plus size={16} />}
              >
                {editingTask ? 'Update Task' : 'Buat Task'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};