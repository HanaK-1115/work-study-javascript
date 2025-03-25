const PaidLeaveApplication = require('../models/PaidLeaveApplication');
const PaidLeaveManagement = require('../models/PaidLeaveManagement');
const User = require('../models/User');

const { isWeekend, subDays } = require('date-fns');

// 有給休暇の申請
exports.applyForPaidLeave = async (req, res) => {
  const { userId, startDate, endDate, reason, holidays } = req.body;

  try {
    // 有給管理テーブルからユーザーの残有給日数を取得
    const leaveManagement = await PaidLeaveManagement.findOne({ where: { userId } });

    if (!leaveManagement) {
      return res.status(404).json({ message: 'ユーザーの有給管理情報が見つかりません。' });
    }

    const daysRequested = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

    if (leaveManagement.remainingLeaveDays < daysRequested) {
      return res.status(400).json({ message: '有給残日数が不足しています。' });
    }

    // 提出日を計算する関数
    const calculateSubmissionDate = async (startDate) => {
      let date = new Date(startDate);
      do {
        date = subDays(date, 1); // 一日前に移動
      } while (isWeekend(date) || holidays.some(holiday => new Date(holiday.date).toDateString() === date.toDateString()));
      return date;
    };

    const submissionDate = await calculateSubmissionDate(startDate);

    // 有給休暇申請を作成
    const application = await PaidLeaveApplication.create({
      userId,
      startDate,
      endDate,
      reason,
      submissionDate,
      lastUpdatedByUserId: userId, // 最終更新ユーザーIDをユーザーIDと同じに設定
      approvalStatus: 2, // 承認待ち
    });

    // 残有給日数を更新
    leaveManagement.remainingLeaveDays -= daysRequested;
    await leaveManagement.save();

    res.status(201).json(application);
  } catch (error) {
    console.error('有給休暇申請の登録に失敗しました。', error);
    res.status(500).json({ message: '有給休暇申請の登録に失敗しました。' });
  }
};


// ユーザーの有給休暇申請を取得
exports.getLeaveApplications = async (req, res) => {
  const { userId } = req.params;

  try {
    const applications = await PaidLeaveApplication.findAll({ where: { userId } });
    res.json(applications);
  } catch (error) {
    console.error('有給休暇申請の取得に失敗しました。', error);
    res.status(500).json({ message: '有給休暇申請の取得に失敗しました。' });
  }
};

// 有給休暇申請の状態を更新
exports.updateLeaveApplicationStatus = async (req, res) => {
    const { applicationIds, status } = req.body;
  
    try {
      const applications = await PaidLeaveApplication.findAll({ where: { id: applicationIds } });
  
      if (applications.length === 0) {
        return res.status(404).json({ message: '指定された有給休暇申請が見つかりません。' });
      }
      
      await PaidLeaveApplication.update({ approvalStatus: status }, { where: { id: applicationIds } });
      
      if (status === 4) {
        for (const application of applications) {
          console.log(`Processing application ID: ${application.id}`); // 有給管理テーブルからユーザーの残有給日数を取得
          
          const leaveManagement = await PaidLeaveManagement.findOne({ where: { userId: application.userId } });

          if (!leaveManagement) {
            return res.status(404).json({ message: 'ユーザーの有給管理情報が見つかりません。' });
          }

          const daysRequested = (new Date(application.endDate) - new Date(application.startDate)) / (1000 * 60 * 60 * 24) + 1;
          
          leaveManagement.remainingLeaveDays += daysRequested;
          await leaveManagement.save();
        }
      }
      
      res.status(200).json({ message: '有給休暇申請の状態が更新されました。' });
    } catch (error) {
      console.error('有給休暇申請の状態更新に失敗しました。', error);
      res.status(500).json({ message: '有給休暇申請の状態更新に失敗しました。' });
    }
  };
  
  exports.getPaidLeaveApplications = async (req, res) => {
    const { department } = req.params;
  
    try {
      const applications = await PaidLeaveApplication.findAll({
        include: {
          model: User,
          attributes: ['lastName', 'firstName'],
          where: { department }
        }
      });
  
      res.status(200).json(applications);
    } catch (error) {
      console.error('有給休暇申請の取得に失敗しました。', error);
      res.status(500).json({ message: '有給休暇申請の取得に失敗しました。' });
    }
  };
  
  