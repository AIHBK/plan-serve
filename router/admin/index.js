const express = require('express');
// 导入路由
const adminMethods = require('../../router-methods/admin/methods');
const planMethods = require('../../router-methods/admin/planMethods')
const router = express.Router();
const upload = require('../../upload/upload');

// 用户
router.post('/login', adminMethods.Login); // 用户登陆
router.post('/regUser', adminMethods.regUser); // 用户注册
router.get('/usersData', adminMethods.getUsersData); // 获取用户信息

// 计划
router.get('/getPlanData', planMethods.getPlanData); // 获取计划
router.post('/addPlanData', planMethods.addPlanData); // 


module.exports = router;