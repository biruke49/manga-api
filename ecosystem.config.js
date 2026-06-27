module.exports = {
  apps: [
    {
      name: 'fleet-api',
      script: 'dist/src/main.js',
      instances: 1,
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};
