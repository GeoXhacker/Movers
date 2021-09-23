module.exports = {
  apps: [
    {
      script: "node bin/www",
      watch: ".",
    },
  ],

  deploy: {
    production: {
      user: "mukisa",
      host: ["167.172.76.19"],
      ref: "origin/main",
      repo: "git@github.com:GeoXhacker/admin-backend.git",
      path: "/home/mukisa/movers-admin",
      "post-deploy": "npm install && pm2 start",
      // 'pre-deploy-local': '',
      // 'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      // 'pre-setup': ''
      
    },
  },
};
