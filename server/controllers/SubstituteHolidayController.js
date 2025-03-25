const SubstituteHolidayApplication = require('../models/SubstituteHolidayApplication');
const User = require('../models/User');

const { isWeekend, subDays } = require('date-fns');

// 振替休日の申請
exports.applyForSubstituteHolidayApplication = async (req, res) => {
  const { userId, holidayWorkApplicationId, substituteDate} = req.body;

  try {

    // 振替休日申請を作成
    const application = await SubstituteHolidayApplication.create({
      userId,
      holidayWorkApplicationId,
      workDate,
      reason,
      lastUpdatedByUserId: userId, // 最終更新ユーザーIDをユーザーIDと同じに設定
      approvalStatus: 2, // 承認待ち
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('振替休日申請の登録に失敗しました。', error);
    res.status(500).json({ message: '振替休日申請の登録に失敗しました。' });
  }
};


// ユーザーの振替休日申請を取得
exports.getSubstituteHolidayApplications = async (req, res) => {
  const { userId } = req.params;

  try {
    const applications = await SubstituteHolidayApplication.findAll({ where: { userId } });
    res.json(applications);
  } catch (error) {
    console.error('振替休日申請の取得に失敗しました。', error);
    res.status(500).json({ message: '振替休日申請の取得に失敗しました。' });
  }
};

// 振替休日申請の状態を更新
exports.updateSubstituteHolidayApplicationStatus = async (req, res) => {
    const { applicationIds, status } = req.body;
  
    try {
      const applications = await PaidLeaveApplication.findAll({ where: { id: applicationIds } });
  
      if (applications.length === 0) {
        return res.status(404).json({ message: '指定された振替休日申請が見つかりません。' });
      }
      
      await PaidLeaveApplication.update({ approvalStatus: status }, { where: { id: applicationIds } });
      res.status(200).json({ message: '振替休日申請の状態が更新されました。' });

    } catch (error) {
      console.error('振替休日申請の状態更新に失敗しました。', error);
      res.status(500).json({ message: '振替休日申請の状態更新に失敗しました。' });
    }
};
  
exports.getSubstituteHolidayApplications = async (req, res) => {
    const { department } = req.params;
  
    try {
      const applications = await SubstituteHolidayApplication.findAll({
        include: {
          model: User,
          attributes: ['lastName', 'firstName'],
          where: { department }
        }
      });
  
      res.status(200).json(applications);
    } catch (error) {
      console.error('振替休日申請の取得に失敗しました。', error);
      res.status(500).json({ message: '振替休日申請の取得に失敗しました。' });
    }
};
  
  