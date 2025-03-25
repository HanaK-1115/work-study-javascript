const User = require('../models/User');
const PaidLeaveManagement = require('../models/PaidLeaveManagement');

exports.registerUser = async (req, res) => {
    const { username, password, department, lastName, firstName, join_date, remaining_leave_days, role } = req.body;
  
    if (!username || !password || !department || !lastName || !firstName || !join_date || !remaining_leave_days || !role) {
      return res.status(400).json({ message: '全てのフィールドを入力してください。' });
    }
  
    try {
      const newUser = await User.create({
        username,
        password,
        department,
        lastName,
        firstName,
        role
      });
  
      await PaidLeaveManagement.create({
        userId: newUser.id,
        joinDate: join_date,
        remainingLeaveDays: remaining_leave_days
      });
  
      res.status(201).json({ message: 'ユーザーが正常に登録されました。' });
    } catch (error) {
      console.error('ユーザー登録に失敗しました。', error); // 詳細なエラーログを出力
      res.status(500).json({ message: 'ユーザー登録に失敗しました。', error: error.message });
    }
  };
exports.signInUser = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'ユーザー名とパスワードを入力してください。' });
    }
  
    try {
      const user = await User.findOne({ where: { username, password } });
      if (!user) {
        return res.status(401).json({ message: 'ユーザー名またはパスワードが間違っています。' });
      }
      res.status(200).json({ message: 'ログインが成功しました。', user });
    } catch (error) {
      res.status(500).json({ message: 'ログインに失敗しました。', error: error.message });
    }
};
exports.getUserLeaveDays = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming userId is passed as a URL parameter
    console.log(`Fetching leave days for user ID: ${userId}`);
    
    const leaveData = await PaidLeaveManagement.findOne({ where: { userId } });
    if (!leaveData) {
      console.log('No leave data found for user:', userId);
      return res.status(404).json({ message: '有給管理データが見つかりません。' });
    }

    console.log('Leave data found:', leaveData.toJSON());
    res.json({ remaining_leave_days: leaveData.remainingLeaveDays });
  } catch (error) {
    console.error('有給管理データの取得に失敗しました。', error);
    res.status(500).json({ message: '有給管理データの取得に失敗しました。' });
  }
};
