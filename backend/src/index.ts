import 'dotenv/config';
import app from './app';
import { PORT } from './config';

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
