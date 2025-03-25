import React, { useState } from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import PaidLeaveApplications from './PaidLeaveApplications';
// 他の申請コンポーネントもここでインポート

const ApplicationsOverview = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Tabs value={selectedTab} onChange={handleChange}>
          <Tab label="有給休暇" />
          <Tab label="休日出勤" />
          {/* 必要に応じて他のタブを追加 */}
        </Tabs>
        <Box sx={{ width: '100%', mt: 2 }}>
          {selectedTab === 0 && <PaidLeaveApplications />}
          {selectedTab === 1 && <div>休日出勤申請コンポーネント</div>}
          {/* 他のタブに対応するコンポーネントをここに追加 */}
        </Box>
      </Box>
    </Container>
  );
};

export default ApplicationsOverview;
