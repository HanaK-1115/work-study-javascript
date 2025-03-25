const cron = require('node-cron');
const PaidLeaveManagement = require('../models/PaidLeaveManagement');

const sequelize = require('../config/db'); // DB接続設定

// 勤続年数に応じた有給日数
const calculateAnnualLeaveDays = (yearsOfService) => {
  if (yearsOfService >= 6.5) return 20;
  if (yearsOfService >= 5.5) return 18;
  if (yearsOfService >= 4.5) return 16;
  if (yearsOfService >= 3.5) return 14;
  if (yearsOfService >= 2.5) return 12;
  if (yearsOfService >= 1.5) return 11;
  if (yearsOfService >= 0.5) return 10;
  return 0; // 勤続年数が0.5年未満の場合は無視
};

// 毎日午前0時に実行されるタスクをスケジュール
cron.schedule('0 0 * * * *', async () => {
  console.log('有給日数の更新を開始します...');

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  try {
    // トランザクションの開始
    await sequelize.transaction(async (t) => {
      const paidLeaveRecords = await PaidLeaveManagement.findAll({ transaction: t });

      for (const record of paidLeaveRecords) {
        const joinDate = new Date(record.joinDate);
        const yearsOfService = (today - joinDate) / (1000 * 60 * 60 * 24 * 365); // 勤続年数を計算

        if (currentMonth === 4 && currentDay === 1) {
          // 毎年4月1日に発生する有給
          const annualLeaveDays = calculateAnnualLeaveDays(yearsOfService);

          // 繰り越し可能な日数を考慮
          const carriedOverDays = Math.min(record.remainingLeaveDays, annualLeaveDays);

          // 新しい有給日数を追加
          record.remainingLeaveDays = carriedOverDays + annualLeaveDays;
        } else if (yearsOfService >= 0.5 && Math.floor(yearsOfService) === 0 && record.remainingLeaveDays < 1) {
          // 入社半年後の有給発生日
          const annualLeaveDays = 10; // 入社半年後の有給日数は固定で10日

          record.remainingLeaveDays += annualLeaveDays;
        }

        // レコードの保存
        await record.save({ transaction: t });
      }
    });

    console.log('有給日数の更新が完了しました。');
  } catch (error) {
    console.error('有給日数の更新に失敗しました。', error);
  }
});

