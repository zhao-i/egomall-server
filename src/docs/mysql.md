## mysql egomall.staff(工作人员表)
    id(mediumint)(自增标识符)
    phone(char11)(手机号)
    password(MD5 char32)(加密密码)
    name(varchar16)(真实名字)
    gender(tinyint)(性别)
## mysql egomall.staff.column(权限控制)
    status(tinyint)(账号状态) default value: 1
    level(tinyint)(权限等级) default value: 0
    evaluation(tinyint)(管理评价) default value: 0
    commodity(tinyint)(管理商品) default value: 0
    put(tinyint)(上架下架商品) default value: 0
    buil(tinyint)(查看账单) default value: 0
## mysql egomall.user(用户信息表)

## mysql egomall.commodity(商品信息表)