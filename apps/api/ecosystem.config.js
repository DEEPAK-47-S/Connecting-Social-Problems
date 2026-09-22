module.exports = {
  apps: [
    {
      name: "social-impact-api",
      script: "dist/index.js", // Assumes API is built to dist folder
      instances: "max", // Uses all available CPU cores to handle load
      exec_mode: "cluster", // Enables PM2's built-in load balancer
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
  ],
};
