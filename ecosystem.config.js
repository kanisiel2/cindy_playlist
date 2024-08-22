module.exports = {
  apps : [{
      name   : "backend",
      cwd: "./backend",
      script : "npm",
      args : "run server",    
      watch: ["src"],
    },
    {
      name   : "frontend",
      cwd: "./frontend",
      script : "npm",
      args : "run serve",    
      watch: ["build"],
      ignore_watch : ["node_modules", "client/img", "\\.git", "*.log", "public", "src", "*.json"],
    },
  ]
}
