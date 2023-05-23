const { v4: uuidv4 } = require('uuid');
const db = require('../../db/mysql');
const sd = require('silly-datetime'); // 获取时间
let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
// state = 0 sql-error
// state = 1 success
// state = 2 fail
// state = 3 null
// state >= 4 other

/**
 * 添加计划
 * @param {*} req 
 * @param {*} res 
 */
exports.addPlanData = (req, res) => {
  
}

/**
 * 获取用户计划信息
 * @param {*} req 
 * @param {*} res 
 */
exports.getPlanData = (req, res) => {
  console.log('-req.session', req.session);
  // if (!req.session.loginStatus) {
  //   return res.send({
  //     state: 0,
  //     message: 'fail'
  //   })
  // }
  let sql = 'select * from plan WHERE userId=?';
  console.log('req.query', req.query);
  if (req.query.id === '1') {
    sql = 'select * from plan'
  }
  db.query({
    sql: sql,
    values: [req.query.id]
  },(err, data) => {
    if (err) {
      console.log('getPlanData.err', err);
      return res.send(
        {
          state: 0,
          msg: 'sql-err'
        }
      )
    }
    console.log('getPlanData.success', data.length);
    return res.send({
      state: 1,
      msg: 'success',
      result: data
    });
  })
}