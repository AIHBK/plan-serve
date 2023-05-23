const { v4: uuidv4 } = require('uuid');
const db = require('../../db/mysql');
const sd = require('silly-datetime'); // 获取时间
let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
const { jwt, expressJWT, secretKey  } = require('../../config/token')

// 引入支付宝配置文件
const alipaySdk = require('../../until/alipayUntil')
const AlipaySdkFormData = require('alipay-sdk/lib/form').default
// state = 0 sql-error
// state = 1 success
// state = 2 fail
// state = 3 null
// state >= 4 other


/**
 * 登陆接口
 * @param {*} req 
 * @param {*} res 
 */
exports.Login = (req, res) => {
  const sql = 'select * from user where phone=? and password=?';
  db.query({
    sql: sql,
    values: [req.body.phone, req.body.password]
  },(err, data) => {
    if (err) {
      console.log(err);
      return res.send(
        {
          state: 0,
          msg: 'sql-err'
        }
      )
    }
    if (data.length === 1) {
      // req.session.user = req.body
      // req.session.loginStatus = true
      // console.log('----------', req.session);
      // sign 
      // 参数1：信息对象
      // 参数2：密钥
      // 参数3：配置对象 token有效时长
      const tokenStr = jwt.sign({
        ...req.body
      },
      secretKey,
      {
        expiresIn: '30s'
      }
      )

      db.query({
        sql: 'select * from userinfo',
      }, (err, selectData) => {
        // delete data[0].password
        console.log('Login.success.data', data);
        return res.send({
              state: 1,
              msg: 'success',
              result: data,
              tokenStr
          });
      }) 
    } else {
      console.log('Login.success.已存在');
      return res.send({
        state: 3,
        msg: 'null',
        result: data
      });
    }
  })
}

/**
 * 注册接口
 * @param {*} req 
 * @param {*} res 
 */
exports.regUser = (req, res) => {
  req.body.id = uuidv4()
  req.body.createDate = sd.format(new Date(), 'YYYY-MM-DD HH:mm'); // 当前时间
  console.log(req.body);
  db.query({
      sql: 'select * from user where phone=?',
      values: [req.body.phone]
  },(err,data)=>{
      if(err){
          console.log('regUser.select.sql-err', err);
          return res.send({
              state: 0,
              msg: 'sql-err'
          });
      }
      if(data.length > 0){
          return res.send({
              state: 3,
              msg: '用户已存在'
          });
      }
      db.query({
          sql: 'insert into user set ?',
          values:[req.body]
      }, (err, data) => {
          if(err){
              console.log('regUser.sql-err-fail', err);
              return res.send({
                  state: 0,
                  msg: 'sql-err-fail'
              });
          }
          console.log('regUser.success', data);
          return res.send({
              state: 1,
              msg: 'success'
          });
      });
  }) 
}

/**
 * 获取用户信息接口
 * @param {*} req 
 * @param {*} res 
 * @param {*} req.query.type -1 已拒绝  0 待审核   
 */
exports.getUsersData = (req, res) => {
  let sql = 'select * from user WHERE status=?';
  db.query({
    sql: sql,
    values: [req.query.type]
  },(err, data) => {
    if (err) {
      console.log('getUsersData.err', err);
      return res.send(
        {
          state: 0,
          msg: 'sql-err'
        }
      )
    }
    console.log('getUsersData.success', data.length);
    return res.send({
      state: 1,
      msg: 'success',
      result: data
    });
  })
}


/**
 * 文件上传
 * @param {*} req 
 * @param {*} res 
 */
exports.uploadFile = (req, res) => {
  req.body.id = uuidv4()
  req.body.url = `http://127.0.0.1:3000/img/${req.file.filename}`
  req.body.createDate = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
  console.log('req-----', req.body );
  const sql = `insert into books set ?`;
  db.query({
    sql: sql,
    values: [req.body]
  }, (err, data) => {
    if (err) {
      console.log('uploadFile.err', err);
      return res.send(
        {
          state: 0,
          msg: 'sql-err'
        }
      ) 
    }
    console.log('uploadFile.success');
    return res.send({
      state: 1,
      msg: 'success'
    });
  })
}
