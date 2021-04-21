module.exports = {
  mongoUrl: 'mongodb://thoruser:292ebff20f50@mongodb:16839/pb_store?authSource=admin',
  emailSender: {
    enable: false,
    user: 'email_user_name',
    pwd: 'email_pwd',
    email: 'email_user_name@foo.bar',
    smtp_address: 'smtp.foo.bar'
  },
  sysAlertEmail: 'foo@bar.com',
  rootUser: {
    name: 'root',
    password: 'root_pwd',
    email: 'foo@.foobar.foo'
  }
};