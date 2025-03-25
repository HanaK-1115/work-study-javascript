const API_URL = 'https://192.168.0.152:5000/api';

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '登録に失敗しました。');
  }

  return await response.json();
};

export const signInUser = async (userData) => {
  const response = await fetch(`${API_URL}/users/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'ログインに失敗しました。');
  }

  return await response.json();
};

export const fetchHolidays = async () => {
  const response = await fetch(`${API_URL}/holidays`);
  if (!response.ok) {
    throw new Error('祝日情報の取得に失敗しました。');
  }
  return await response.json();
};

export const fetchRemainingLeaveDays = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}/leave-days`);
  if (!response.ok) {
    throw new Error('有給残日数の取得に失敗しました。');
  }
  return await response.json();
};

export const fetchLeaveApplications = async (userId) => {
  const response = await fetch(`${API_URL}/paid-leave/applications/${userId}`);
  if (!response.ok) {
    throw new Error('有給申請の取得に失敗しました。');
  }
  return await response.json();
};

export const submitLeaveApplication = async (userId, startDate, endDate, reason, holidays) => {
  const response = await fetch(`${API_URL}/paid-leave/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, startDate, endDate, reason, holidays }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '有給申請の登録に失敗しました。');
  }

  return await response.json();
};

export const updateLeaveApplicationStatus = async (applicationIds, status) => {
  const response = await fetch(`${API_URL}/paid-leave/update-status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ applicationIds, status }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '有給申請の更新に失敗しました。');
  }

  return await response.json();
};

export const fetchPaidLeaveApplications = async (department) => {
  const response = await fetch(`${API_URL}/paid-leave/applications-all/${department}`);
  if (!response.ok) {
    throw new Error('有給休暇申請の取得に失敗しました。');
  }
  return await response.json();
};