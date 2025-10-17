import { useEffect, useState } from "react";
import { Card, Col, Row, Table, Tag, Avatar, Space, Typography, message } from "antd";
import { CheckCircle, Clock, ListTodo, TrendingUp, Users, ActivityIcon } from "lucide-react";

const { Title, Text } = Typography;

type Status =
  | "Belum Dimulai"
  | "Sedang Dikerjakan"
  | "Sedang Direvisi"
  | "Blocked"
  | "Selesai";

export const HomePage = () => {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [taskLogData, setTaskLogData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: Status): string => {
    switch (status) {
      case "Belum Dimulai": return "default";
      case "Sedang Dikerjakan": return "processing";
      case "Sedang Direvisi": return "warning";
      case "Blocked": return "error";
      case "Selesai": return "success";
      default: return "default";
    }
  };  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); 
        
        const [tasksRes, logsRes] = await Promise.all([
          fetch("http://localhost:3000/api/get-task"), 
          fetch("http://localhost:3000/api/get-task-log"),
        ]); 
  
        if (!tasksRes.ok) {
          throw new Error(`Tasks fetch failed: ${tasksRes.status} ${tasksRes.statusText}`);
        }
        if (!logsRes.ok) {
          throw new Error(`Logs fetch failed: ${logsRes.status} ${logsRes.statusText}`);
        }
  
        const tasks = await tasksRes.json();
        const logs = await logsRes.json();
  
        console.log("Raw tasks data:", tasks);
        console.log("Raw logs data:", logs);
  
        setProgressData(tasks?.data || []);
        setTaskLogData(logs?.data || []);
  
      } catch (error: any) {
        console.error("Fetch error details:", error);
        message.error(error.message || "Terjadi kesalahan saat fetch data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);


  const activeTasksCount = progressData.filter((t) => t.status === "Sedang Dikerjakan").length;
  const completedTasksCount = progressData.filter((t) => t.status === "Selesai").length;
  const teamMembers = [...new Set(progressData.map((t) => t.penanggung_jawab))];
  const teamCount = teamMembers.length;
  const memberActivityCount = progressData.reduce<Record<string, number>>((acc, task) => {
    acc[task.penanggung_jawab] = (acc[task.penanggung_jawab] || 0) + 1;
    return acc;
  }, {});
  const mostActiveMember = Object.entries(memberActivityCount).sort((a, b) => b[1] - a[1])[0];

  const taskColumns = [
    {
      title: "Task",
      dataIndex: "task",
      key: "task",
      render: (text: string, record: any) => (
        <Space>
          <Avatar style={{ background: "linear-gradient(to bottom right, #6366f1, #a855f7)" }}>
            {record.penanggung_jawab
              ?.split(" ")
              ?.map((n: string) => n[0])
              ?.join("")}
          </Avatar>
          <div>
            <Text strong>{text}</Text>
            <div className="text-gray-500 text-xs">{record.penanggung_jawab}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Periode",
      key: "periode",
      render: (_: any, record: any) => (
        <div>
          <p>Mulai: {new Date(record.tanggalMulai).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</p>
          <p>Deadline: {new Date(record.tanggalDeadline).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</p>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
  ];

  const logColumns = [
    { title: "Tanggal", dataIndex: "tanggal", key: "tanggal" },
    { title: "Detail Aktivitas", dataIndex: "detail_aktivitas", key: "detail_aktivitas" },
    { title: "Deadline", dataIndex: "durasi_deadline", key: "durasi_deadline" },
  ];

  return (
    <div className="space-y-6">
      <Title level={2}>Dashboard Overview</Title>
      <Text type="secondary">Selamat datang! Berikut ringkasan aktivitas tim Anda</Text>

          {/* Statistik */}
          <Row gutter={[16, 16]} className="!mt-10">
            <Col xs={24} sm={12} lg={6}>
              <Card 
                loading={loading}
                className="!rounded-lg h-28! !shadow-md hover:!shadow-lg transition-all duration-300 border-0"
                bodyStyle={{ padding: '16px' }}
              >
                <div className="!flex !items-center !gap-3">
                  <div className="!flex !items-center !justify-center !w-12 !h-12 !rounded-lg !bg-blue-50">
                    <Clock className="!text-blue-600 !w-6 !h-6" />
                  </div>
                  <div className="!flex-1">
                    <div className="!text-sm !text-gray-500 !mb-1">Task Berjalan</div>
                    <div className="!text-2xl !font-semibold !text-gray-800">{activeTasksCount}</div>
                  </div>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card 
                loading={loading}
                className="!rounded-lg h-28! !shadow-md hover:!shadow-lg transition-all duration-300 border-0"
                bodyStyle={{ padding: '16px' }}
              >
                <div className="!flex !items-center !gap-3">
                  <div className="!flex !items-center !justify-center !w-12 !h-12 !rounded-lg !bg-green-50">
                    <CheckCircle className="!text-green-600 !w-6 !h-6" />
                  </div> 
                  <div className="!flex-1">
                    <div className="!text-sm !text-gray-500 !mb-1">Task Selesai</div>
                    <div className="!text-2xl !font-semibold !text-gray-800">{completedTasksCount}</div>
                  </div>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card 
                loading={loading}
                className="!rounded-lg h-28! !shadow-md hover:!shadow-lg transition-all duration-300 border-0"
                bodyStyle={{ padding: '16px' }}
              >
                <div className="!flex !items-center !gap-3">
                  <div className="!flex !items-center !justify-center !w-12 !h-12 !rounded-lg !bg-purple-50">
                    <Users className="!text-purple-600 !w-6 !h-6" />
                  </div>
                  <div className="!flex-1">
                    <div className="!text-sm !text-gray-500 !mb-1">Anggota Tim</div>
                    <div className="!text-2xl !font-semibold !text-gray-800">{teamCount}</div>
                  </div>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card 
                loading={loading}
                className="!rounded-lg h-28! !shadow-md hover:!shadow-lg transition-all duration-300 border-0"
                bodyStyle={{ padding: '16px' }}
              >
                <div className="!flex !items-center !gap-3">
                  <div className="!flex !items-center !justify-center !w-12 !h-12 !rounded-lg !bg-orange-50">
                    <TrendingUp className="!text-orange-600 !w-6 !h-6" />
                  </div>
                  <div className="!flex-1">
                    <div className="!text-sm !text-gray-500 !mb-1">Paling Aktif</div>
                    <div className="!text-lg !font-medium !text-gray-800 !mb-1">
                      {mostActiveMember?.[0] || "-"}
                    </div>
                    <div className="!text-xs !text-gray-500">
                      {mostActiveMember?.[1] || 0} task
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Daftar task & log */}
          <Row gutter={[16, 16]}>
            <Col className="w-full!">
                    <Card
                      title={
                        <Space>
                          <ListTodo className="text-indigo-600" />
                          <span>Task Terbaru</span>
                        </Space>
                      }
                    >
                      <Table
                        loading={loading}
                        columns={taskColumns}
                        dataSource={progressData.slice(0, 3)}
                        rowKey="id"
                        pagination={false}
                      />
                    </Card>
                  </Col>

                  <Col className="w-full!">
                    <Card
                      title={
                        <Space>
                          <ActivityIcon className="text-purple-600" />
                          <span>Aktivitas Terbaru</span>
                        </Space>
                      }
                    >
                      <Table
                        loading={loading}
                        columns={logColumns}
                        dataSource={taskLogData.slice(0, 3)}
                        rowKey="id"
                        pagination={false}
                      />
                    </Card>
                  </Col>
          </Row>
      </div>
  );
};
