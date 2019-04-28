import app from './src/index';

const server = app;

const PORT = process.env.PORT || 4000;

server.listen(PORT, err => {
  if (err) throw err;
  console.log(`server running on port :: ${PORT}`);
});
