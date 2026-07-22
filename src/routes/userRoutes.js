function my(app) {
  app.get('/users', (req, res) => {
    // Logic to get users
    res.send('Get all users');
  });