module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://wzjiqehovzmxwn:39004004fa35c7e70858e8aa5d9d29069a2658b12684d240626b00f247c260ad@ec2-54-166-167-192.compute-1.amazonaws.com:5432/d1fv4ic876enfl',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://zacharyjameson@localhost/moviedex-test'
};
