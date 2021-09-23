module.exports = {
  script: "serve",
  env: {
    NODE_ENV: "production",
  },

  deploy: {
    production: {
      user: "mukisa",
      host: ["167.172.76.19"],
      ref: "origin/main",
      repo: "git@github.com:GeoXhacker/Movers.git",
      path: "/home/mukisa/movers-client",
      "post-deploy": "npm install && npm run build && pm2 serve www",
      // 'pre-deploy-local': '',
      // 'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      // 'pre-setup': ''
    },
  },
};
