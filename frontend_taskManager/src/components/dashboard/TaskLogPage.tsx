import { Table, Tag, Card, message, Spin, Button, Space, DatePicker } from 'antd';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { ColumnsType } from 'antd/es/table';

interface TaskLog {
  id: number;
  tanggal: string;
  detail_aktivitas: string;
  durasi: string;
  status: string;
  durasi_saat_ini: string;
  durasi_deadline: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Selesai':
      return 'green';
    case 'Sedang Dikerjakan':
      return 'blue';
    case 'Belum Dimulai':
      return 'volcano';
    default:
      return 'default';
  }
};

export const TaskLogPage: React.FC = () => {
  const [taskLogData, setTaskLogData] = useState<TaskLog[]>([]);
  const [filteredData, setFilteredData] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchTaskLogData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Memulai fetch data task log...");
      
      const response = await fetch("http://localhost:3000/api/get-task-log");
      
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log("Data task log dari API:", result);
      
      if (result.data) {
        setTaskLogData(result.data);
        setFilteredData(result.data);
      } 
      else if (Array.isArray(result)) {
        setTaskLogData(result);
        setFilteredData(result);
      }
      else {
        console.warn("Struktur data task log tidak dikenali:", result);
        setTaskLogData([]);
        setFilteredData([]);
      }
      
    } catch (error: any) {
      console.error("Error fetching task log data:", error);
      setError(error.message || "Terjadi kesalahan saat mengambil data task log");
      message.error("Gagal mengambil data task log");
    } finally {
      setLoading(false);
    }
  };

  const isSameDate = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }; 

  const formatDateString = (dateString: string): string => {
    const date = new Date(dateString);
    return formatDate(date);
  }; 


  const filterByDate = (dateString: string | null) => {
    if (!dateString) {
      setFilteredData(taskLogData);
      return;
    }

    const filterDate = new Date(dateString);
    const filtered = taskLogData.filter(item => {
      const itemDate = new Date(item.tanggal);
      return isSameDate(itemDate, filterDate);
    });

    setFilteredData(filtered);
  };

  const handleDateChange = (date: any) => {
    if (!date) {
      setSelectedDate(null);
      setFilteredData(taskLogData);
      return;
    }

    const dateString = date.format('YYYY-MM-DD');
    setSelectedDate(dateString);
    filterByDate(dateString);
  };

  const handleResetDateFilter = () => {
    setSelectedDate(null);
    setFilteredData(taskLogData);
  };

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Pilih setidaknya satu task log untuk dihapus');
      return;
    }

    try {
      setDeleteLoading(true);
      
      const confirmDelete = window.confirm(
        `Apakah Anda yakin ingin menghapus ${selectedRowKeys.length} task log?`
      );
      
      if (!confirmDelete) return;

      const response = await fetch('http://localhost:3000/api/task-log/delete-multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedRowKeys  
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert("deleted success!!")
        message.success(`Berhasil menghapus ${selectedRowKeys.length} task log`);
        
        const newData = taskLogData.filter(item => !selectedRowKeys.includes(item.id));
        setTaskLogData(newData);
        setFilteredData(newData);
        
        setSelectedRowKeys([]);
      } else {
        throw new Error(result.message || 'Gagal menghapus task log');
      }
      
    } catch (error: any) {
      message.error(error.message || 'Gagal menghapus task log');
    } finally {
      setDeleteLoading(false);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  useEffect(() => {
    fetchTaskLogData();
  }, []);

  const columns: ColumnsType<TaskLog> = [
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      render: (text: string) => (
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Calendar className="w-4 h-4 text-gray-400" />
          {new Date(text).toLocaleDateString("id-ID", { 
            day: "2-digit", 
            month: "short", 
            year: "numeric" 
          })}
        </div>
      ),
    },
    {
      title: 'Detail Aktivitas',
      dataIndex: 'detail_aktivitas',
      key: 'detail_aktivitas',
      render: (text: string) => (
        <span className="text-sm text-gray-700">{text}</span>
      ),
    },
    {
      title: 'Durasi',
      dataIndex: 'durasi_saat_ini',
      key: 'durasi_saat_ini',
      render: (text: string) => (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-indigo-600">{text}</span>
        </div>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'durasi_deadline',
      key: 'durasi_deadline',
      render: (text: string) => (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-indigo-600">{text}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="font-semibold text-xs px-3 py-1">
          {status}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Log</h1>
          <p className="text-gray-600">Riwayat aktivitas dan update task</p>
        </div>
        <Card className="rounded-xl shadow-md flex justify-center items-center h-64">
          <Spin size="large" />
          <span className="ml-4 text-gray-600">Memuat data task log...</span>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Log</h1>
          <p className="text-gray-600">Riwayat aktivitas dan update task</p>
        </div>
        <Card className="rounded-xl shadow-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <h3 className="text-lg font-semibold">Gagal Memuat Data Task Log</h3>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Coba Lagi
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Log</h1>
        <p className="text-gray-600">Riwayat aktivitas dan update task</p>
      </div>

      <Card className="rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by Tanggal:</span>
            </div>
            
            <div className="w-full md:w-48">
              <DatePicker
                onChange={handleDateChange}
                className="w-full"
                format="DD/MM/YYYY"
                placeholder="Pilih tanggal"
                allowClear={true}
              />
            </div>

            <Button
              onClick={handleResetDateFilter}
              disabled={!selectedDate}
            >
              Reset Filter
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            Menampilkan {filteredData.length} dari {taskLogData.length} task log
            {selectedDate && (
              <span className="ml-2 text-blue-600">
                (Tanggal: {formatDateString(selectedDate)})
              </span>
            )}
          </div>
        </div> 
      </Card>

      <Card className="rounded-xl shadow-md">
        <div className="mb-4 flex justify-between items-center">
          <div>
            {selectedRowKeys.length > 0 && (
              <span className="text-gray-600">
                {selectedRowKeys.length} task log terpilih
              </span>
            )}
          </div>
          
          <Space>
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
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
          loading={loading}
        />
      </Card>
    </div>
  );
};