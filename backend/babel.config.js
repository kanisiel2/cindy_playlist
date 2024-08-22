module.exports = {
    presets: ['@babel/env', "@babel/preset-react" ],
    plugins:
        [ "@babel/plugin-syntax-jsx" ],
    //   process.env.NODE_ENV === 'production'
    //     ? ['transform-remove-console', '@babel/plugin-transform-runtime']
    //     : ['@babel/plugin-transform-runtime'],
      ignore: ['./src/public/**/*.js'],
  };