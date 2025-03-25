import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, Table, TableBody, TableCell, TableHead, TableRow, Checkbox, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fetchHolidays, fetchRemainingLeaveDays, fetchLeaveApplications, submitLeaveApplication, updateLeaveApplicationStatus } from '../../services/api'; 
import { useAuth } from '../../hooks/useAuth';

const PaidLeaveRequest = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState('');
  const [leaveDays, setRemainingLeaveDays] = useState(0);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [approvalStatus, setApprovalStatus] = useState(''); 

  useEffect(() => {
    const getHolidays = async () => {
      try {
        const holidaysData = await fetchHolidays();
        setHolidays(holidaysData);
      } catch (error) {
        console.error('祝日情報の取得に失敗しました。', error);
      }
    };

    const getRemainingLeaveDays = async () => {
      try {
        const leaveData = await fetchRemainingLeaveDays(user.id);
        setRemainingLeaveDays(leaveData.remaining_leave_days);
      } catch (error) {
        console.error('有給残日数の取得に失敗しました。', error);
      }
    };

    const getLeaveApplications = async () => {
      try {
        const leaveApplicationsData = await fetchLeaveApplications(user.id);
        setLeaveApplications(leaveApplicationsData);
      } catch (error) {
        console.error('有給申請の取得に失敗しました。', error);
      }
    };

    getHolidays();
    getRemainingLeaveDays();
    getLeaveApplications();
  }, [user.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!startDate || !endDate || !reason) {
      setError('全てのフィールドを入力してください。');
      return;
    }

    if (startDate > endDate) {
      setError('終了日は開始日より後の日付にしてください。');
      return;
    }

    const isHolidayOrWeekend = (date) => {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        return true; // 土曜日または日曜日
      }
      return holidays.some(holiday => new Date(holiday.date).toDateString() === date.toDateString());
    };

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (isHolidayOrWeekend(d)) {
        setError('指定された期間に祝日または休日が含まれています。再入力してください。');
        return;
      }
    }

    const daysRequested = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
    if (leaveDays < daysRequested) {
      setError('有給残日数が不足しています。');
      return;
    }

    setError('');
    try {
      const response = await submitLeaveApplication(user.id, startDate, endDate, reason, holidays);
      console.log('有給申請が成功しました。', response);

      // 新しい申請を追加して表示を更新
      setLeaveApplications([...leaveApplications, response]);
      setRemainingLeaveDays(leaveDays - daysRequested);
    } catch (error) {
      console.error('有給申請の登録に失敗しました。再試行してください。', error);
      setError('有給申請の登録に失敗しました。再試行してください。');
    }
  };

  const handleSelectApplication = (applicationId, approvalStatus) => {
    if (approvalStatus === 4 || (approvalStatus === 1 && user.role > 1)) return; // キャンセル状態か、承認済みかつ権限が1以下でない場合は何もしない
    setSelectedApplications(prevSelected =>
      prevSelected.includes(applicationId)
        ? prevSelected.filter(id => id !== applicationId)
        : [...prevSelected, applicationId]
    );
  };

  const handleStatusUpdate = async (approvalStatus) => {
    try {
      const response = await updateLeaveApplicationStatus(selectedApplications, approvalStatus);
      console.log('有給申請の状態が更新されました。', response);

      // 申請の状態を更新して表示を更新
      setLeaveApplications(leaveApplications.map(app => 
        selectedApplications.includes(app.id) ? { ...app, approvalStatus } : app
      ));
      setSelectedApplications([]);
    } catch (error) {
      console.error('有給申請の状態更新に失敗しました。再試行してください。', error);
      setError('有給申請の状態更新に失敗しました。再試行してください。');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleApprovalStatusChange = (event) => {
    setApprovalStatus(event.target.value);
  };

  const filteredLeaveApplications = leaveApplications.filter(application => {
    const applicationDate = new Date(application.startDate);
    const matchesApprovalStatus = approvalStatus === '' || application.approvalStatus === parseInt(approvalStatus, 10);
    return applicationDate.getFullYear() === year && (applicationDate.getMonth() + 1) === month && matchesApprovalStatus;
  });

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const selectableApplications = filteredLeaveApplications
        .filter(application => application.approvalStatus !== 4 && (application.approvalStatus !== 1 || user.role <= 1))
        .map(application => application.id);
      setSelectedApplications(selectableApplications);
    } else {
      setSelectedApplications([]);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          有給申請
        </Typography>
        <Typography component="h2" variant="h6">
          残有給日数: {leaveDays}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="開始日"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
              <DatePicker
                label="終了日"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Box>
          </LocalizationProvider>
          <TextField
            margin="normal"
            required
            fullWidth
            id="reason"
            label="理由"
            name="reason"
            autoComplete="reason"
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            申請
          </Button>
        </Box>
        <Typography component="h2" variant="h6" sx={{ mt: 4, mb: 2 }}>
          申請一覧
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <FormControl sx={{ minWidth: 80 }}>
            <InputLabel>年</InputLabel>
            <Select value={year} onChange={handleYearChange} size="small">
              {[...Array(5)].map((_, index) => {
                const y = new Date().getFullYear() - 2 + index;
                return (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 80 }}>
            <InputLabel>月</InputLabel>
            <Select value={month} onChange={handleMonthChange} size="small">
              {[...Array(12)].map((_, index) => (
                <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>承認状態</InputLabel>
            <Select value={approvalStatus} onChange={handleApprovalStatusChange} size="small">
              <MenuItem value="">全て</MenuItem>
              <MenuItem value="1">承認</MenuItem>
              <MenuItem value="2">承認待ち</MenuItem>
              <MenuItem value="3">否認</MenuItem>
              <MenuItem value="4">キャンセル</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedApplications.length === filteredLeaveApplications.filter(application => application.approvalStatus !== 4 && (application.approvalStatus !== 1 || user.role <= 1)).length}
                  indeterminate={selectedApplications.length > 0 && selectedApplications.length < filteredLeaveApplications.filter(application => application.approvalStatus !== 4 && (application.approvalStatus !== 1 || user.role <= 1)).length}
                />
              </TableCell>
              <TableCell>開始日</TableCell>
              <TableCell>終了日</TableCell>
              <TableCell>理由</TableCell>
              <TableCell>承認状態</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeaveApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedApplications.includes(application.id)}
                    onChange={() => handleSelectApplication(application.id, application.approvalStatus)}
                    disabled={application.approvalStatus === 4 || (application.approvalStatus === 1 && user.role > 1)}
                  />
                </TableCell>
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
        <Box sx={{ mt: 2 }}>
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
            onClick={() => handleStatusUpdate(4)}
            disabled={selectedApplications.length === 0}
          >
            キャンセル
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PaidLeaveRequest;
