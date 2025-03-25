import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, Box, Container, TextField, MenuItem, Select, FormControl, InputLabel, Checkbox } from '@mui/material';
import { fetchPaidLeaveApplications, updateLeaveApplicationStatus} from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const PaidLeaveApplications = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [error, setError] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [year, setYear] = useState(currentYear); // デフォルトを現在の年に設定
  const [month, setMonth] = useState(currentMonth); // デフォルトを現在の月に設定
  const [status, setStatus] = useState('');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState(''); 

  useEffect(() => {
    const getApplications = async () => {
      try {
        const applicationsData = await fetchPaidLeaveApplications(user.department);
        setApplications(applicationsData);
        setFilteredApplications(applicationsData);
      } catch (error) {
        console.error('有給休暇申請の取得に失敗しました。', error);
        setError('有給休暇申請の取得に失敗しました。');
      }
    };
    getApplications();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleFilter = () => {
    let filtered = applications;

    if (searchUser) {
      filtered = filtered.filter(app =>
        `${app.User.lastName} ${app.User.firstName}`.includes(searchUser)
      );
    }

    if (year) {
      filtered = filtered.filter(app => new Date(app.submissionDate).getFullYear() === parseInt(year));
    }

    if (month) {
      filtered = filtered.filter(app => new Date(app.submissionDate).getMonth() + 1 === parseInt(month));
    }

    if (status) {
      filtered = filtered.filter(app => app.approvalStatus === parseInt(status));
    }

    setFilteredApplications(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [searchUser, year, month, status]);

  const handleSelectApplication = (applicationId, approvalStatus) => {
    if (approvalStatus === 4 || (approvalStatus === 1 && user.role > 1)) return; // キャンセル状態か、承認済みかつ権限が1以下でない場合は何もしない
    setSelectedApplications(prevSelected =>
      prevSelected.includes(applicationId)
        ? prevSelected.filter(id => id !== applicationId)
        : [...prevSelected, applicationId]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const selectableApplications = filteredApplications
        .filter(application => application.approvalStatus !== 4 && (application.approvalStatus !== 1 || user.role <= 1))
        .map(application => application.id);
      setSelectedApplications(selectableApplications);
    } else {
      setSelectedApplications([]);
    }
  };

  const handleStatusUpdate = async (approvalStatus) => {
    try {
      // 選択された申請が存在しない場合は何もしない
      if (selectedApplications.length === 0) return;
  
      // 更新リクエストを送信
      const response = await updateLeaveApplicationStatus(selectedApplications,approvalStatus);
  
      // サーバーからのレスポンスを確認
        const updatedApplications = applications.map(app =>
          selectedApplications.includes(app.id)
            ? { ...app, approvalStatus }
            : app
        );
  
        setApplications(updatedApplications);
        setFilteredApplications(updatedApplications);
        setSelectedApplications([]);
    } catch (error) {
      console.error('申請の状態更新に失敗しました。', error);
      setError('申請の状態更新に失敗しました。再試行してください。');
    }
  };

  const handleDownloadCSV = () => {
    if (selectedApplications.length === 0) {
      setError('CSV出力するデータを選択してください。');
      return;
    }

    const csvRows = [];
    const headers = ['申請者', '提出日', '開始日', '終了日', '理由', '承認状態'];
    csvRows.push(headers.join(','));

    selectedApplications.forEach(id => {
      const application = applications.find(app => app.id === id);
      if (application) {
        const row = [
          `${application.User.lastName} ${application.User.firstName}`,
          formatDate(application.submissionDate),
          formatDate(application.startDate),
          formatDate(application.endDate),
          application.reason,
          application.approvalStatus === 1 ? '承認' : application.approvalStatus === 2 ? '承認待ち' : application.approvalStatus === 3 ? '否認' : 'キャンセル'
        ];
        csvRows.push(row.join(','));
      }
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', '有給休暇申請一覧.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          有給休暇申請一覧
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="申請者"
            variant="outlined"
            size="small"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>年</InputLabel>
            <Select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              size="small"
            >
              {[...Array(5)].map((_, index) => {
                const y = currentYear - 2 + index;
                return (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 80 }}>
            <InputLabel>月</InputLabel>
            <Select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              size="small"
            >
              {[...Array(12)].map((_, index) => (
                <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>承認状態</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              size="small"
            >
              <MenuItem value={1}>承認</MenuItem>
              <MenuItem value={2}>承認待ち</MenuItem>
              <MenuItem value={3}>否認</MenuItem>
              <MenuItem value={4}>キャンセル</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedApplications.length === filteredApplications.filter(application => application.approvalStatus !== 4 && (application.approvalStatus !== 1 || user.role <= 1)).length}
                  indeterminate={selectedApplications.length > 0 && selectedApplications.length < filteredApplications.filter(application => application.approvalStatus !== 4 && (application.approvalStatus !== 1 || user.role <= 1)).length}
                />
              </TableCell>
              <TableCell>申請者</TableCell>
              <TableCell>提出日</TableCell>
              <TableCell>開始日</TableCell>
              <TableCell>終了日</TableCell>
              <TableCell>理由</TableCell>
              <TableCell>承認状態</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedApplications.includes(application.id)}
                    onChange={() => handleSelectApplication(application.id, application.approvalStatus)}
                    disabled={application.approvalStatus === 4 || (application.approvalStatus === 1 && user.role > 1)}
                  />
                </TableCell>
                <TableCell>{`${application.User.lastName} ${application.User.firstName}`}</TableCell>
                <TableCell>{formatDate(application.submissionDate)}</TableCell>
                <TableCell>{formatDate(application.startDate)}</TableCell>
                <TableCell>{formatDate(application.endDate)}</TableCell>
                <TableCell>{application.reason}</TableCell>
                <TableCell>
                  {application.approvalStatus === 1 ? '承認' : application.approvalStatus === 2 ? '承認待ち' : application.approvalStatus === 3 ? '否認' : 'キャンセル'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          {user.role <= 1 && (
            <>
              <Button
                variant="contained"
                onClick={() => handleStatusUpdate(1)}
                disabled={selectedApplications.length === 0}
                sx={{ mr: 2 }}
              >
                承認
              </Button>
              <Button
                variant="contained"
                onClick={() => handleStatusUpdate(3)}
                disabled={selectedApplications.length === 0}
                sx={{ mr: 2 }}
              >
                否認
              </Button>
            </>
          )}
          <Button
            variant="contained"
            onClick={handleDownloadCSV}
            disabled={selectedApplications.length === 0}
          >
            CSV出力
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PaidLeaveApplications;
