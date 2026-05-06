module.exports = {
  apps: [
    {
      name: 'lumina-bff',
      script: 'src/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '300M',
      out_file: '/var/log/lumina-bff/out.log',
      error_file: '/var/log/lumina-bff/err.log',
      time: true,
    },
  ],
};
