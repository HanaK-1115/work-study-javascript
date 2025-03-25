import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import { registerUser } from '../../services/api';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const theme = createTheme();

const SignUpForm = () => {
  const navigate = useNavigate(); // useNavigateフックを使用
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
    const passwordConfirm = data.get('passwordConfirm');
    const lastName = data.get('lastName');
    const firstName = data.get('firstName');
    const join_date = data.get('joinDate');
    const remaining_leave_days = data.get('paidLeaveDays');

    if (!username || !password || !passwordConfirm || !department || !role || !lastName || !firstName || !join_date || !remaining_leave_days) {
      setError('全てのフィールドを入力してください。');
      return;
    }

    if (password !== passwordConfirm) {
      setError('パスワードが一致しません。');
      return;
    }

    setError('');

    try {
      const response = await registerUser({
        username,
        password,
        department,
        lastName,
        firstName,
        join_date,
        remaining_leave_days,
        role,
      });
      console.log('登録が成功しました。', response);
      navigate('/register-success'); // 登録完了画面に遷移
    } catch (error) {
      console.error('登録に失敗しました。再試行してください。', error); // エラーメッセージをログ出力
      setError(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            アカウント登録
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="ユーザー名"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="パスワード"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="パスワード（確認用）"
                  type="password"
                  id="passwordConfirm"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="姓"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="名"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="department-label">所属部署</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department"
                    name="department"
                    value={department}
                    label="所属部署"
                    onChange={handleDepartmentChange}
                  >
                    <MenuItem value="1">本社</MenuItem>
                    <MenuItem value="2">産業機器システム開発</MenuItem>
                    <MenuItem value="3">LSI設計</MenuItem>
                    <MenuItem value="4">ソフトウェア設計</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="role-label">権限レベル</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={role}
                    label="権限レベル"
                    onChange={handleRoleChange}
                  >
                    <MenuItem value="1">管理者</MenuItem>
                    <MenuItem value="2">従業員</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="joinDate"
                  label="入社年月日"
                  name="joinDate"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="paidLeaveDays"
                  label="有給休暇残日数"
                  name="paidLeaveDays"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText="※不明や曖昧な場合は、管理者に確認お願いします。"
                />
              </Grid>
            </Grid>
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
              登録
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  すでにアカウントをお持ちですか？サインイン
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUpForm;
