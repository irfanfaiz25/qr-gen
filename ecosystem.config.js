module.exports = {
  apps: [
    {
      name: 'qr-generator-api',
      script: './server.js',
      
      // Instances
      instances: 1,
      exec_mode: 'cluster',
      
      // Environment Variables
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3002
      },
      
      // Logging
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Advanced features
      watch: false,
      ignore_watch: [
        'node_modules',
        'logs',
        'storage',
        'test-output',
        'test-storage-output',
        '.git'
      ],
      
      // Restart options
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      
      // Process management
      kill_timeout: 5000,
      listen_timeout: 3000,
      shutdown_with_message: true,
      
      // Source map support
      source_map_support: true,
      
      // Merge logs
      merge_logs: true,
      
      // Cron restart (optional - restart every day at 3 AM)
      // cron_restart: '0 3 * * *',
      
      // Post-deploy hooks (optional)
      // post_update: 'npm install && pm2 reload ecosystem.config.js --env production',
      
      // Error handling
      exp_backoff_restart_delay: 100
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:username/qr-gen.git',
      path: '/var/www/qr-generator',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': '',
      'post-setup': 'npm install'
    },
    staging: {
      user: 'deploy',
      host: 'staging-server.com',
      ref: 'origin/develop',
      repo: 'git@github.com:username/qr-gen.git',
      path: '/var/www/qr-generator-staging',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env staging',
      'pre-deploy-local': '',
      'post-setup': 'npm install'
    }
  }
};

