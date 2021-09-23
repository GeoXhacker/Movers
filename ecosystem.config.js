module.exports = {
  script: "serve",
  env: {
    NODE_ENV: "production",
    PM2_SERVE_PATH: "www/",
    PM2_SERVE_PORT: 8080,
    PM2_SERVE_SPA: "true",
  },

  deploy: {
    production: {
      user: "mukisa",
      host: ["167.172.76.19"],
      ref: "origin/main",
      repo: "git@github.com:GeoXhacker/Movers.git",
      path: "/home/mukisa/movers-client",
      "post-deploy": "npm install && npm run build && pm2 serve --spa",
      // 'pre-deploy-local': '',
      // 'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      // 'pre-setup': ''
    },
  },
};
