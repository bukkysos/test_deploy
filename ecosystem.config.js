module.exports = {
    name: 'dashboardUI',
    script: 'server.js',
    "log_date_format"  : "YYYY-MM-DD HH:mm Z",

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: "4",
    error_file : "C:\\pm2_system\\.pm2\\logs\\sm-api-error",
    out_file: "C:\\pm2_system\\.pm2\\logs\\sm-api-out",
    autorestart: true,
    watch: "true",
    max_restarts: 10,
    max_memory_restart: '1G',
    env_production: {
        NODE_ENV: 'production',
        NODE_PORT: "443"
    },
    exec_mode: "cluster",
};
