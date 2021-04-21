module.exports = {
  mongoUrl: 'mongodb://user:pwd@db_ip:db_port/db_name',
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
  },
};