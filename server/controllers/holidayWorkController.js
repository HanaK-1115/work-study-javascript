const HolidayWorkApplication = require('../models/HolidayWorkApplication');
const User = require('../models/User');

const { isWeekend, subDays } = require('date-fns');

// 休日出勤の申請
exports.applyForHolidayWork = async (req, res) => {
  const { userId, workDate, reason, holidays } = req.body;

  try {

    // 提出日を計算する関数
    const calculateSubmissionDate = async (workDate) => {
      let date = new Date(workDate);
      do {
        date = subDays(date, 1); // 一日前に移動
      } while (isWeekend(date) || holidays.some(holiday => new Date(holiday.date).toDateString() === date.toDateString()));
      return date;
    };

    const submissionDate = await calculateSubmissionDate(workDate);

    // 休日出勤申請を作成
    const application = await HolidayWorkApplication.create({
      userId,
      submissionDate,
      workDate,
      reason,
      lastUpdatedByUserId: userId, // 最終更新ユーザーIDをユーザーIDと同じに設定
      approvalStatus: 2, // 承認待ち
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('休日出勤申請の登録に失敗しました。', error);
    res.status(500).json({ message: '休日出勤申請の登録に失敗しました。' });
  }
};


// ユーザーの休日出勤申請を取得
exports.getHolidayWorkApplications = async (req, res) => {
  const { userId } = req.params;

  try {
    const applications = await HolidayWorkApplication.findAll({ where: { userId } });
    res.json(applications);
  } catch (error) {
    console.error('休日出勤申請の取得に失敗しました。', error);
    res.status(500).json({ message: '休日出勤申請の取得に失敗しました。' });
  }
};

// 休日出勤申請の状態を更新
exports.updateHolidayWorkApplicationStatus = async (req, res) => {
    const { applicationIds, status } = req.body;
  
    try {
      const applications = await PaidLeaveApplication.findAll({ where: { id: applicationIds } });
  
      if (applications.length === 0) {
        return res.status(404).json({ message: '指定された休日出勤申請が見つかりません。' });
      }
      
      await PaidLeaveApplication.update({ approvalStatus: status }, { where: { id: applicationIds } });
      res.status(200).json({ message: '休日出勤申請の状態が更新されました。' });

    } catch (error) {
      console.error('休日出勤申請の状態更新に失敗しました。', error);
      res.status(500).json({ message: '休日出勤申請の状態更新に失敗しました。' });
    }
};
  
exports.getHolidayWorkApplications = async (req, res) => {
    const { department } = req.params;
  
    try {
      const applications = await HolidayWorkApplication.findAll({
        include: {
          model: User,
          attributes: ['lastName', 'firstName'],
          where: { department }
        }
      });
  
      res.status(200).json(applications);
    } catch (error) {
      console.error('休日出勤申請の取得に失敗しました。', error);
      res.status(500).json({ message: '休日出勤申請の取得に失敗しました。' });
    }
};
  
  