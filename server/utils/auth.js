const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';



  module.exports = {
    AuthenticationError: new GraphQLError('Could not authenticate user.', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    }),
    authMiddleware: function ({ req }) {
      let token = req.body.token || req.query.token || req.headers.authorization;
  
      if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
      }
  
      if (!token) {
        return req;
      }
      console.log("Token  ", token)
      try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration });
        console.log("veryfy userd --- > ",data)
        req.user = data;
      } catch {
        console.log('Invalid token');
      }
      
      return req;
    },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    console.log("Thi si sthe payload for thew new user:  ", payload)
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
